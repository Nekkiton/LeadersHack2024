from typing import Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas import OID
from app.literals import Skills, VacancyStatus, WorkScopes, WorkTypes, WorkSchedules, WorkExperiences


class StageItem(BaseModel):
    title: str
    auto_interview: bool
    approve_template: str
    reject_template: str
    position: int


class StageItemResponse(StageItem):
    id: OID = Field(alias="_id")


class StageItemUpdate(StageItem):
    id: Optional[OID] = Field(default=None, alias="_id")


class VacancyPost(BaseModel):
    title: str
    scope: WorkScopes
    description: Optional[str] = None
    responsabilities: str
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


class VacancyResponse(VacancyUpdate):
    id: OID = Field(alias="_id")
    status: VacancyStatus
    responses: int
    stages: List[StageItemResponse]
    created_at: datetime


class PaginationResponse(BaseModel):
    total_pages: int
    page: int
    items: List[Any]


class PaginationVacanciesResponse(PaginationResponse):
    items: List[VacancyResponse]
