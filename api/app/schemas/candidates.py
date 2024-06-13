from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

from . import Pagination, UserGet
from app.literals import Educations, Skills, WorkExperiences, WorkSchedules, WorkTypes


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


class CandidateGet(CandidatePost, UserGet):
    """
    Возвращаемые данные для соискателя
    """
    pass


class CandidatesGet(Pagination):
    items: List[CandidateGet]


class CandidateMatch(CandidateGet):
    match: int


class CandidatesMatchGet(Pagination):
    items: List[CandidateMatch]


class CandidatePartial(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    phone: Optional[PhoneNumber] = None
    telegram: Optional[str] = None
    birthday: Optional[datetime] = None
    city: Optional[str] = None
    job_title: Optional[str] = None
    education: Optional[Educations] = None
    work_schedule: Optional[WorkSchedules] = None
    work_type: Optional[WorkTypes] = None
    work_experience: Optional[WorkExperiences] = None
    work_history: Optional[List[WorkHistoryItem]] = None
    salary_expectation: Optional[float] = None
    skills: Optional[List[Skills]] = None
