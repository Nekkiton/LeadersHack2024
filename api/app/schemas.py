from bson import ObjectId
from decimal import Decimal
from datetime import datetime
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


class UserResponse(BaseModel):
    """
    Минимальные возвращаемые данные по пользователю
    """
    id: OID = Field(alias="_id")
    email: EmailStr
    role: Role


class WorkHistoryItem(BaseModel):
    company: str
    job_title: str
    start_date: datetime
    end_date: datetime
    responsabilites: str


class CandidatePost(BaseModel):
    """
    Заполнение соискателя
    """
    name: str
    surname: str
    patronymic: Optional[str]
    phone: PhoneNumber
    telegram: str
    birthday: datetime
    city: str
    job_title: str
    education_id: OID
    work_schedule_id: OID
    work_type_id: OID
    work_experience_id: OID
    work_history: List[WorkHistoryItem]
    salary_expectation: Decimal = Field(decimal_places=2)
    skills: List[OID]


class CandidateResponse(CandidatePost, UserResponse):
    """
    Возвращаемые данные для соискателя
    """
    pass
