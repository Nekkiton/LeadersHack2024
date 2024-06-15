import pymongo
from typing import List
from fastapi import APIRouter

from app.oauth import UserId
from app.database import Notifications

from .schemas import NotificationGet


router = APIRouter(prefix="/notifications")

@router.get(
    "/",
    name="Получить все свои уведомления",
    response_model=List[NotificationGet]
    )
async def get_notifications(
    user_id: UserId
    ):
    return list(Notifications.find({"user_id": user_id}).sort('created_at', pymongo.DESCENDING))


@router.post(
    "/read",
    name="Отметить все уведомления как прочитанные",
    response_model=List[NotificationGet]
    )
async def mark_as_read_notifications(
    user_id: UserId
    ):
    Notifications.update_many({"user_id": user_id}, {"$set": {"is_read": True}})
    return list(Notifications.find({"user_id": user_id}))
