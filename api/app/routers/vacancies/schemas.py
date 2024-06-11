from typing import List, Optional
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


class VacancyResponse(VacancyPost):
    id: OID = Field(alias="_id")
    status: VacancyStatus
    responses: int
    stages: List[StageItemResponse]


class PaginationVacanciesResponse(BaseModel):
    total_pages: int
    page: int
    items: List[VacancyResponse]
