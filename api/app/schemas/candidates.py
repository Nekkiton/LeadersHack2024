from datetime import datetime, MAXYEAR
from typing import List, Optional, Self
from pydantic import BaseModel, model_validator
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.schemas import Preferences
from app.literals import Educations, Skills, WorkExperiences, WorkSchedules, WorkTypes

from . import Pagination, UserGet, MatchItem


class WorkHistoryItem(BaseModel):
    company: str
    position: str
    start_date: datetime
    end_date: Optional[datetime] = None
    responsibilities: str


class CandidateValidators(BaseModel):
    work_history: List[WorkHistoryItem]

    @model_validator(mode="after")
    def sort_work_history(self: Self) -> Self:
        if self.work_history is not None and len(self.work_history):
            max_datetime = datetime(year=MAXYEAR, month=12, day=30, hour=23, minute=59, second=59)
            self.work_history.sort(key=lambda item: item.end_date if item.end_date is not None else max_datetime, reverse=True)
            

class CandidatePost(CandidateValidators):
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
    preferences: Preferences


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


class CandidatePartial(CandidateValidators):
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
