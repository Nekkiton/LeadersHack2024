from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema
from typing import Any, List, Literal, Optional
from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumber


Role = Literal["recruiter", "candidate"]


class OID(str):
    @classmethod
    def __get_pydantic_core_schema__(
            cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


class BaseResponse(BaseModel):
    """
    Дополнительные поля, возвращаемые из Монго
    """
    _id: OID


class UserResponse(BaseResponse):
    """
    Дополнительные возвращаемые поля пользователя
    """
    role: Role
    password: str = Field(exclude=True)


class UserBase(BaseModel):
    """
    Минимальные данные по пользователю
    """
    email: EmailStr
    password: str


class UserCommon(UserBase):
    """
    Общие поля у обоих типов пользователей
    """
    name: str
    surname: str
    patronymic: Optional[str]
    phone: PhoneNumber
    telegram: str
    birthday: datetime


class RecruiterPost(UserCommon):
    """
    Регистрация рекрутера
    """
    interviews_per_day: int
    interview_slots: List[OID]


class CandidatePost(UserCommon):
    """
    Регистрация соискателя
    """
    city: str
    job_title: str
    education_id: OID
    work_schedule_id: OID
    work_type_id: OID
    work_experience_id: OID
    work_history: List[OID]
    skills: List[OID]
    responses: List[OID]


class UserBaseResponse(UserBase, BaseResponse):
    """
    Возвращаемые поля для минимального пользователя
    """
    password: str = Field(exclude=True)


class CandidateResponse(CandidatePost, UserResponse):
    """
    Возвращаемые данные для соискателя
    """
    pass


class RecruiterResponse(RecruiterPost, UserResponse):
    """
    Возвращаемые данные для рекрутера
    """
    pass
