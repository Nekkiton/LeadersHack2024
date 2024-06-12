from bson import ObjectId
from datetime import datetime
from app.literals import Educations, Skills, WorkExperiences, WorkSchedules, WorkTypes, Role
from pydantic_core import core_schema
from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumber


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
    end_date: Optional[datetime] = None
    responsabilites: str


class CandidatePost(BaseModel):
    """
    Заполнение соискателя
    """
    email: str
    name: str
    surname: str
    patronymic: Optional[str] = None
    phone: PhoneNumber
    telegram: str
    birthday: datetime
    city: str
    job_title: str
    education: Educations
    work_schedule: WorkSchedules
    work_type: WorkTypes
    work_experience: WorkExperiences
    work_history: List[WorkHistoryItem]
    salary_expectation: float
    skills: List[Skills]


class CandidateResponse(CandidatePost, UserResponse):
    """
    Возвращаемые данные для соискателя
    """
    pass


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


class RecruiterResponse(RecruiterPost, UserResponse):
    """
    Возвращаемые данные для рекрутера
    """
    pass
