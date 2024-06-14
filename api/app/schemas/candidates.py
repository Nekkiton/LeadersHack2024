from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from pydantic_extra_types.phone_numbers import PhoneNumber

from . import Pagination, UserGet, MatchItem
from app.literals import Educations, Skills, WorkExperiences, WorkSchedules, WorkTypes


class WorkHistoryItem(BaseModel):
    company: str
    position: str
    start_date: datetime
    end_date: Optional[datetime] = None
    responsibilities: str


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
    desired_position: str
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
    match: Optional[MatchItem] = None
    items: List[CandidateMatch]


class WorkHistoryItemPartial(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    responsibilities: Optional[str] = None


class CandidatePartial(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None
    birthday: Optional[datetime] = None
    city: Optional[str] = None
    desired_position: Optional[str] = None
    education: Optional[Educations] = None
    work_schedule: Optional[WorkSchedules] = "5/2"
    work_type: Optional[WorkTypes] = "Удаленно"
    work_experience: Optional[WorkExperiences] = None
    work_history: List[WorkHistoryItemPartial] = []
    salary_expectation: Optional[float] = None
    skills: List[Skills] = []
