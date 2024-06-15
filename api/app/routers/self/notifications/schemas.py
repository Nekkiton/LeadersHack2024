from datetime import datetime

from app.schemas import BaseGet


class NotificationGet(BaseGet):
    title: str
    content: str
    created_at: datetime
    is_read: bool
