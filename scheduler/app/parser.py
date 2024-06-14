from requests import get, post
import json
import logging
import re
from bson import json_util

from app.database import Vacancies
from app.settings import Settings
from bs4 import BeautifulSoup

def parse_vacancies_from_rntgroup() -> None:
    """
    Собирает вакансии с https://rntgroup.com/career/vacancies/ в Mongo.
    Не самый красивый код, но работает
    """
    response = get("https://rntgroup.com/career/vacancies/")
    if response.status_code != 200:
        return logging.warning(
            f"Проблема в получении HTML сайта. "
            f"Запрос вернул {response.status_code} "
            f"с содержанием {response.text}"
        )
    existing_vacancies = {vacancy["url"] for vacancy in Vacancies.find({"source.company": "RNTGroup"}, {"url": "$source.url"})}
    pages = BeautifulSoup(response.text, "html.parser").find(attrs={"data-id": "8935"})
    pages = pages.findChild(name="div", attrs={"class": "maxwidth-theme"}).findAll(recursive=False)[2:]
    new_vacancies = {}
    still_existing_vacancies = []
    for cards in pages:
        for card in cards.find_all(recursive=False):
            url = card.find(name="a").attrs.get("href")
            if not url.startswith("https://"):
                url = "https://www.rntgroup.com" + url
            if url in new_vacancies:
                continue
            if url in existing_vacancies and url not in still_existing_vacancies:
                still_existing_vacancies.append(url)
                continue

            vacancy = BeautifulSoup(get(url).text, "html.parser")
            title = vacancy.find(name="h1", attrs={"class": "block-title-text"}).getText(strip=True)
            content_blocks = vacancy.find(attrs={"id": "blocks_wrapper"}).find_all(recursive=False)[1:-1]

            description_and_tasks = content_blocks[0].find(name="div", attrs={"class": "block-subtitle"})
            description_and_tasks = description_and_tasks.getText(separator="|||", strip=True).split("|||")
            description = description_and_tasks[0]
            responsibilities = '\n'.join(description_and_tasks[2:])
            
            conditions_raw = content_blocks[-1].find_all(name="div", attrs={"class": "service-name block-el-title"})
            conditions = '\n'.join([condition.getText(strip=True) for condition in conditions_raw])

            candidate_expectation = additions = None

            for next_content_block in content_blocks[1:-1]:
                find_responsibilities = next_content_block.find(string=re.compile("Задачи",flags=re.IGNORECASE))
                find_candidate_expectation = next_content_block.find(string=re.compile("навыки|знания",flags=re.IGNORECASE))
                find_additions = next_content_block.find(string=re.compile("Будет плюсом",flags=re.IGNORECASE))
                
                extracted_info = '\n'.join(next_content_block.getText(separator="|||", strip=True).split("|||")[1:])
                if find_responsibilities is not None:
                    responsibilities = extracted_info
                elif find_candidate_expectation is not None:
                    candidate_expectation = extracted_info
                elif find_additions is not None or additions is None:
                    additions = extracted_info
                else:
                    additions += extracted_info

            new_vacancies[url] = {
                "title": title,
                "description": description,
                "responsibilities": responsibilities,
                "candidate_expectation": candidate_expectation,
                "additions": additions,
                "conditions": conditions,
                "source": {
                    "company": "RNTGroup",
                    "url": url
                },
                "status": "active"
            }
    result = Vacancies.insert_many(new_vacancies.values())
    logging.info("Добавлено новых вакансий: ", len(result.inserted_ids))
    result = Vacancies.update_many(
        {
            "source.company": "RNTGroup", 
            "source.url": {"$nin": list(new_vacancies.keys()) + list(still_existing_vacancies)}
        }, 
        {
            "$set": { "status": "closed" }
        }
        )
    logging.info("Устарело вакансий: ", result.modified_count)

    # logic for updating new vacancies
    for url in new_vacancies:
        try:
            res = post(
                url=f'{Settings.AI_URL}/public/process-vacancy',
                data=json_util.dumps(new_vacancies[url]),
            )

            if response.status_code != 200:
                logging.warning(
                    f"Проблема в обработке вакансии через AI API. "
                    f"Запрос вернул {response.status_code} "
                    f"с содержанием {response.text}"
                )
                continue

            updated_vacancy = res.json()

            result = Vacancies.update_one(
            {
                "source.company": "RNTGroup", 
                "source.url": url
            }, 
            {
                "$set": { 
                    "scope": updated_vacancy["scope"],
                    "work_type": updated_vacancy["work_type"],
                    "work_schedule": updated_vacancy["work_schedule"],
                    "work_experience": updated_vacancy["work_experience"],
                    "skills": updated_vacancy["skills"],
                }
            }
            )

        except Exception as ex:
            logging.warning(
                f"Проблема в обработке обновленной вакансии. "
                f"Ошибка: {ex} "
            )
            raise ex