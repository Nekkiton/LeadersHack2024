from bson import ObjectId

from app.database import Notifications


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
