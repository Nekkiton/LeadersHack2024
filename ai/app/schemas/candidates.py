from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

from app.literals import Educations, Skills, WorkExperiences, WorkSchedules, WorkTypes


class WorkHistoryItem(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    responsibilities: str

class CandidatePartial(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None
    birthday: Optional[str] = None
    city: Optional[str] = None
    desired_position: Optional[str] = None
    education: Optional[str] = None
    work_schedule: Optional[WorkSchedules] = "5/2"
    work_type: Optional[WorkTypes] = "Удаленно"
    work_experience: Optional[WorkExperiences] = None
    work_history: Optional[List[WorkHistoryItem]] = None
    salary_expectation: Optional[str|int|float] = None
    skills: Optional[List[str]] = None
