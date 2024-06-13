from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas import OID, BaseGet, Pagination
from app.literals import Skills, VacancyStatus, WorkScopes, WorkTypes, WorkSchedules, WorkExperiences


class StageItem(BaseModel):
    title: str
    auto_interview: bool
    approve_template: str
    reject_template: str
    position: int


class StageItemGet(StageItem, BaseGet):
    pass


class StageItemUpdate(StageItem):
    id: Optional[OID] = Field(default=None, alias="_id")


class VacancyPost(BaseModel):
    title: str
    scope: WorkScopes
    description: Optional[str] = None
    responsibilities: str
    candidate_expectation: str
    additions: Optional[str] = None
    conditions: Optional[str] = None
    work_type: WorkTypes
    work_schedule: WorkSchedules
    work_experience: WorkExperiences
    salary_from: Optional[int] = None
    salary_to: Optional[int] = None
    skills: List[Skills]
    stages: List[StageItem]


class VacancyUpdate(VacancyPost):
    stages: List[StageItemUpdate]


class VacancyGet(VacancyUpdate, BaseGet):
    status: VacancyStatus
    responses: int
    stages: List[StageItemGet]
    created_at: datetime


class VacancyCandidateGet(VacancyGet):
    match: int


class VacanciesGet(Pagination):
    items: List[VacancyGet]


class VacanciesCandidateGet(Pagination):
    items: List[VacancyCandidateGet]
