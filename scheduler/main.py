from datetime import time
import sys
from time import sleep
from scheduler import Scheduler
from bs4 import BeautifulSoup
from requests import get
import logging


logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] - %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger(__name__)


def parse_vacancies_from_rntgroup() -> None:
    """
    Собирает вакансии с https://rntgroup.com/career/vacancies/ в базу данных
    """
    vacancies_response = get("https://rntgroup.com/career/vacancies/")
    if vacancies_response.status_code != 200:
        return logger.warning(
            f"Проблема в получении HTML сайта. "
            f"Запрос вернул {vacancies_response.status_code} "
            f"с содержанием {vacancies_response.text}"
        )      
    vacancies_pages = BeautifulSoup(vacancies_response.text, "html.parser").find(attrs={"data-id": "8935"}).findChild(name="div", attrs={"class": "maxwidth-theme"}).findAll(recursive=False)[2:]
    vacancies = {}
    for vacancies_cards in vacancies_pages:
        for vacancy_card in vacancies_cards.find_all(recursive=False):
            url = vacancy_card.find(name="a").attrs.get("href")
            if not url.startswith("https://"):
                url = "https://www.rntgroup.com" + url
            vacansy_response = get(url)
            vacancy = BeautifulSoup(vacansy_response.text, "html.parser")
            title = vacancy.find(name="h1", attrs={"class": "block-title-text"}).text.strip()
            content_blocks = vacancy.find(attrs={"id": "blocks_wrapper"}).find_all(recursive=False)[1:-1]
            contents = []
            for content_block in content_blocks:
                contents.append(content_block.getText(strip=True, separator="\n"))
            vacancies[url] = {
                "title": title,
                "contents": contents,
                "source": url
            }


def run_scheduler() -> None:
    schedule = Scheduler()
    schedule.daily(timing=time(hour=0, minute=0, second=0), handle=parse_vacancies_from_rntgroup)
    while True:
        schedule.exec_jobs()
        sleep(1)


if __name__ == "__main__":
    run_scheduler()
