from datetime import datetime, timedelta, timezone
from bson import ObjectId, json_util
from asyncio.log import logger
from requests import get, post
from bs4 import BeautifulSoup
import logging
import re

from app.settings import Settings
from app.utils import create_app_notification, send_mail, create_ics
from app.database import DetailedResponses, Tasks, Users, Vacancies, Stages

from .consts import recruitingDefaultStages


async def proccess_notification(
    title: str, 
    content: str, 
    user_id: ObjectId,
    calendar_orgainzier: ObjectId | None = None,
    calendar_date: datetime | None = None,
    calendar_duration: int | None = None
    ):
    user = Users.find_one({"_id": user_id}, {"preferences": 1, "email": 1})
    preferences = user.get("preferences", {})
    if preferences.get("email_notify", False):
        attachements = {}
        if calendar_date is not None and calendar_duration is not None and calendar_orgainzier is not None:
            organizer = Users.find_one({"_id": calendar_orgainzier}, {"email": 1, "name": 1, "surname": 1})
            ics_bytes = create_ics(
                at=calendar_date,
                duration=calendar_duration,
                org_email=organizer["email"],
                name=title,
                org_name=f"{organizer["name"]} {organizer["surname"]}",
                description=content
            )
            attachements = {"interview.ics": ics_bytes}
        send_mail(receiver=user["email"], subject=title, text=content, attachments=attachements)
    if preferences.get("site_notify", False):
        create_app_notification(title, content, user_id)


async def proccess_meeting(
    platform: str, 
    response_id: ObjectId,
    candidate_id: ObjectId,
    recruiter_id: ObjectId
    ):
    response = DetailedResponses.find_one({"_id": response_id, "status": {"$nin": ["approved", "rejected"]}})
    if not response:
        return
    vacancy_title = response["vacancy"]["title"]
    url = "Не удалось создать"
    match platform:
        case "telemost":
            response = post(
                url="https://cloud-api.yandex.net/v1/telemost-api/conferences",
                headers={"Authorization": "OAuth " + Settings.TELEMOST_API},
                json={"access_level": "PUBLIC",}
            )
            if response.status_code != 200:
                logger.error(response.status_code, response.content.decode("utf-8"))
            url = response.json().get("join_url", "Не удалось создать")
        case _:
            pass
    await proccess_notification(
        title="Встреча создана",
        content=f"Интервью по вакансии {vacancy_title} начнётся через полчаса. Ссылка: {url}",
        user_id=recruiter_id,
        )
    await proccess_notification(
        title="Встреча создана",
        content=f"Интервью по вакансии {vacancy_title} начнётся через полчаса. Ссылка: {url}",
        user_id=candidate_id,
        )


def proccess_rntgroup() -> None:
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
    recruiter = Users.find_one({"role": "recruiter"})
    recruiter_id = recruiter["_id"]
    recruiter_name = recruiter["name"]
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
            if url in existing_vacancies:
                if url not in still_existing_vacancies:
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
                "status": "active",
                "created_at": datetime.now(tz=timezone.utc),
                "updated_at": datetime.now(tz=timezone.utc),
                "recruiter_id": recruiter_id,
            }

    if new_vacancies:
      result = Vacancies.insert_many(new_vacancies.values())
      logging.info("Добавлено новых вакансий: ", len(result.inserted_ids))
    not_for_update_urls = list(new_vacancies.keys()) + list(still_existing_vacancies)
    if len(not_for_update_urls) > 0:
      result = Vacancies.update_many(
          {
              "source.company": "RNTGroup", 
              "source.url": {"$nin": not_for_update_urls}
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
                raise Exception(f"Проблема в обработке вакансии через AI API."
                    f"Запрос вернул {response.status_code} "
                    f"с содержанием {response.text}")

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
                    "updated_at": datetime.now(tz=timezone.utc)
                }
            }
            )

            cur_vacancy_id = Vacancies.find_one({"source.company": "RNTGroup", "source.url": url})["_id"]

            # add hack with stages here
            stages_dumps = []
            for stage in recruitingDefaultStages:
                stages_dumps.append(
                    {
                        **stage,
                        # hack it here to replace constant, should be supported by back in the future
                        "approve_template": stage["approve_template"].replace("RECRUITER_NAME", recruiter_name),
                        "reject_template": stage["reject_template"].replace("RECRUITER_NAME", recruiter_name),
                        # end hack
                        "vacancy_id": cur_vacancy_id,
                        "status": "active",
                        "created_at": datetime.now(tz=timezone.utc),
                        "updated_at": datetime.now(tz=timezone.utc),
                    }
                )
            Stages.insert_many(stages_dumps)

        except Exception as ex:
            logging.warning(
                f"Проблема в обработке обновленной вакансии. "
                f"Ошибка: {ex} "
            )
            #raise ex
            # add hack here to avoid non-filled vacancies
            result = Vacancies.delete_one(
            {
                "source.company": "RNTGroup", 
                "source.url": url
            }
            )
    Tasks.insert_one(
        {
            "type": "rntgroup",
            "status": "pending",
            "execute_at": datetime.now(tz=timezone.utc) + timedelta(hours=24)
        }
    )