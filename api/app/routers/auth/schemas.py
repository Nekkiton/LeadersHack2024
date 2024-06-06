from typing import List
from pydantic import EmailStr, Field, BaseModel


class ApplicantInsert(BaseModel):
    email: EmailStr = Field(title="Почта")
    password: str = Field(title="Пароль")
    first_name: str = Field(title="Имя")
    last_name: str = Field(title="Фамилия")
    telegram: str = Field(title="Telegram @username")
    profession: str = Field(title="Профессия")
    education: List[str] = Field(title="Образование")
    work_format: str = Field(title="Формат работы")
    work_schedule: str = Field(title="График работы")
    work_experience: str = Field(title="Опыт работы")


class RecruiterInsert(BaseModel):
    email: EmailStr = Field(title="Почта")
    password: str = Field(title="Пароль")
    first_name: str = Field(title="Имя")
    last_name: str = Field(title="Фамилия")
    telegram: str = Field(title="Telegram @username")
    interviews_per_day: int = Field(title="Количество интервью в день")


class ApplicantResponse(ApplicantInsert):
    _id: str
    password: str = Field(exclude=True)


class RecruiterResponse(RecruiterInsert):
    _id: str
    password: str = Field(exclude=True)


class Login(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class AuthenticateResponse(BaseModel):
    access_token: str
    access_token_expires: int
    refresh_token: str
    refresh_token_expires: int
    user: ApplicantResponse | RecruiterResponse


