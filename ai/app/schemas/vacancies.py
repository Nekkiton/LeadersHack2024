from typing import List, Optional
from pydantic import BaseModel

from app.literals import Skills, WorkScopes, WorkTypes, WorkSchedules, WorkExperiences


class VacancyPartial(BaseModel):
    title: Optional[str] = None
    scope: Optional[WorkScopes] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    candidate_expectation: Optional[str] = None
    additions: Optional[str] = None
    conditions: Optional[str] = None
    work_type: Optional[WorkTypes] = None
    work_schedule: Optional[WorkSchedules] = None
    work_experience: Optional[WorkExperiences] = None
    salary_from: Optional[int] = None
    salary_to: Optional[int] = None
    skills: Optional[List[Skills]] = None