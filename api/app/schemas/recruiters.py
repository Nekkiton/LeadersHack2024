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


class RecruiterPartial(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    phone: Optional[PhoneNumber] = None
    telegram: Optional[str] = None
    interview_per_day: Optional[int] = None
    interview_slots: Optional[List[InterviewSlotItem]] = None
