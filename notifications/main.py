import asyncio
from asyncio.log import logger
from datetime import datetime, timezone

from bson import ObjectId
from requests import post

from app.mail import Sender
from app.settings import Settings
from app.database import DetailedResponses, Notifications, Tasks, Users


def send_mail(receiver: str, subject: str, text: str):
    """
    TODO: Добавить поддержку HTML-шаблонов по типу сообщений
    """
    Sender.send(
        receivers=receiver,
        subject=subject,
        text=text,
    )


def create_app_notification(
    title: str,
    content: str,
    user_id: ObjectId
    ):
    Notifications.insert_one(
        {
            **locals(),
            "is_read": False,
        }
    )   


async def proccess_notification(
    title: str, 
    content: str, 
    user_id: ObjectId, 
    ):
    user = Users.find_one({"_id": user_id, "preferences.email": True}, {"email": 1})
    if user is not None:
        send_mail(receiver=user["email"], subject=title, content=content)
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


async def run():
    while True:
        pending = list(Tasks.find({"execute_at": {"$lte": datetime.now(tz=timezone.utc)}}))
        for task in pending:
            task_type = task.get("type")
            task_name = "proccess_" + task_type
            kwargs = task.get("body", {})
            proccesser = globals().get(task_name)
            if not proccesser or not asyncio.iscoroutinefunction(proccesser):
                continue
            try:
                asyncio.create_task(function(**kwargs))
            except Exception as e:
                logger.error(f"Task of type {task_type} with kwargs {kwargs} raised exception: {e}")
        asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(run)
