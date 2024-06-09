import json
from typing import List, Optional
from datetime import datetime, time
from pydantic import EmailStr, Field, BaseModel
from pydantic_extra_types.phone_numbers import PhoneNumber


class User(BaseModel):
    """
    Общие поля у обоих типов пользователей
    """
    name: str = Field(title="Имя", examples=["Иван"])
    surname: str = Field(title="Фамилия", examples=["Иванов"])
    patronymic: Optional[str] = Field(title="Отчество", default=None, examples=["Иванович"])
    phone: PhoneNumber = Field(title="Номер телефона", examples=["+79876543210"])
    email: EmailStr = Field(title="Почта", examples=["ivanivanov@ivanovo.com"])
    telegram: str = Field(title="Telegram @username", examples=["@ivanivanov", "ivanivanov"])
    password: str = Field(title="Пароль не менее 8 символов", min_length=8)
    birthday: datetime = Field(title="Дата рождения", examples=["2004-09-11"])



class InterviewSlot(BaseModel):
    start_time: str = Field(title="Начало", pattern=r"(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", examples=["04:19"])
    end_time: str = Field(title="Конец", pattenr=r"(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", examples=["04:20"])


class RecruiterPost(User):
    interviews_per_day: int = Field(title="Количество интервью в день")
    interview_slots: List[InterviewSlot] = Field(title="Временны́е слоты для интервью")


class RecruiterResponse(RecruiterPost):
    _id: str
    role: str
    password: str = Field(exclude=True)


class Login(BaseModel):
    email: EmailStr = Field(title="Почта")
    password: str = Field(title="Пароль")
