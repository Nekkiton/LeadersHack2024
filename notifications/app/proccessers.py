from asyncio.log import logger
from bson import ObjectId
from requests import post

from app.mail import send_mail
from app.settings import Settings
from app.utils import create_app_notification
from app.database import DetailedResponses, Users


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
