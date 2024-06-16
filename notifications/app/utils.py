from datetime import datetime, timedelta, timezone
from ics import Calendar, Event
from bson import ObjectId

from app.database import Notifications
from app.mail import Sender


def create_app_notification(
    title: str,
    content: str,
    user_id: ObjectId
    ):
    Notifications.insert_one(
        {
            **locals(),
            "is_read": False,
            "created_at": datetime.now(tz=timezone.utc)
        }
    )   


def send_mail(receiver: str, subject: str, text: str, attachments: dict = {}):
    Sender.send(
        receivers=receiver,
        subject=subject,
        text=text,
        attachments=attachments
    )


def create_ics(at: datetime, duration: timedelta, name) -> str:
    return Calendar(events=[Event(name=name, begin=at, duration=duration)]).serialize()
