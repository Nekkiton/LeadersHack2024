from datetime import datetime, timedelta, timezone
from ics import Calendar, Event, Organizer
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


def create_ics(at: datetime, duration: timedelta, name: str, org_email: str, org_name: str, description: str) -> bytes:
    event = Event(
        name=name,
        description=description,
        begin=at,
        end=at+duration,
        organizer=Organizer(
            email=org_email,
            common_name=org_name,
        )
    )
    return Calendar(events=[event]).serialize().encode("utf-8")
