from app.parser import parse_vacancies_from_rntgroup
from scheduler import Scheduler
from datetime import time
from time import sleep
import logging


def run() -> None:
    """
    Инициализация планировщика
    """
    schedule = Scheduler()
    schedule.daily(
        timing=time(hour=0, minute=0),
        handle=parse_vacancies_from_rntgroup
        )
    logging.info("Планировщик запущен")
    while True:
        schedule.exec_jobs()
        sleep(60)
