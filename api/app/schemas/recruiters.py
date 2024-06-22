from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.schemas import UserGet, Preferences


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
    image: str
    patronymic: Optional[str] = None
    phone: PhoneNumber
    telegram: str
    interview_per_day: int = Field(gt=0)
    interview_slots: List[InterviewSlotItem] = Field(min_length=1)
    preferences: Preferences


class RecruiterGet(RecruiterPost, UserGet):
    """
    Возвращаемые данные для рекрутера
    """
    pass
