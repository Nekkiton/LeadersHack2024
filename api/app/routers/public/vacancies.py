import math
from typing import Optional
from fastapi import APIRouter, Query, UploadFile

from app.schemas import OID
from app.utils import analyze_candidate_cv
from app.database import DetailedVacancies
from app.literals import VacancyStatus, WorkScopes
from app.schemas.vacancies import VacanciesGet, VacancyGet

router = APIRouter(prefix="/vacancies")


@router.get(
    "/",
    name="Получить вакансии",
    response_model=VacanciesGet
)
async def get_vacancies(
    page: int = Query(0, title="Страница"),
    limit: int = Query(25, title="Элементов на странице"),
    scope: Optional[WorkScopes] = Query(None, title="Направление"),
    status: Optional[VacancyStatus] = Query(None, title="Статус")
):
    query = {}
    if scope is not None:
        query["scope"] = scope
    if status is not None:
        query['status'] = status
    return {
        "total_pages": math.ceil(DetailedVacancies.count_documents(query) / limit),
        "page": page,
        "items": DetailedVacancies.find(query, sort={"created_at": -1}).limit(limit).skip(page * limit)
    }


@router.post(
    "/via-cv",
    name="Получить вакансии, подходящие резюме",
    response_model=list[VacancyGet]
)
async def find_vacancies_via_cv(file: UploadFile):
    candidate = await analyze_candidate_cv(file)
    if not candidate:
        return []
    return DetailedVacancies.find().limit(3)
    # TODO: return 3 best vacancies for candidate with match percent
    # candidate fields can be None (or [])!


@router.get(
    "/{vacancy_id}",
    name="Получить вакансию",
    response_model=VacancyGet,
    )
async def get_vacancy(vacancy_id: OID):
    return DetailedVacancies.find_one({"_id": vacancy_id})
