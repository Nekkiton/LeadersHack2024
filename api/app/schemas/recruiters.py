from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.schemas import UserGet


class InterviewSlotItem(BaseModel):
    start_time: datetime
    end_time: datetime


class RecruiterPost(BaseModel):
    """
    Заполнение рекрутера
    """
    email: str
    name: str
    surname: str
    patronymic: Optional[str] = None
    phone: PhoneNumber
    telegram: str
    interview_per_day: int
    interview_slots: List[InterviewSlotItem]


class RecruiterGet(RecruiterPost, UserGet):
    """
    Возвращаемые данные для рекрутера
    """
    pass
