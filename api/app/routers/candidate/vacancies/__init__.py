from typing import List, Optional
from fastapi import APIRouter, Query

from app.schemas import OID
from app.exceptions import NOT_FOUND
from app.oauth import RequiredCandidateID
from app.literals import Skills, WorkScopes
from app.database import DetailedVacancies, Users
from app.schemas.vacancies import VacanciesCandidateGet, VacancyCandidateGet

from .aggregations import SEARCH_BY_CANDIDATE, SEARCH_BY_ID

router = APIRouter(prefix="/vacancies")


@router.get(
    "/",
    name="Получить вакансии, соответствующие хотя бы на 50%",
    response_model=VacanciesCandidateGet
)
async def get_vacancies(
    candidate_id: RequiredCandidateID,
    page: int = Query(0, title="Страница"),
    limit: int = Query(25, title="Элементов на странице"),
    query: Optional[str] = Query("", title="Поиск по названиям, описаниям"),
    scopes: Optional[List[WorkScopes]] = Query(None, title="Направления", alias='scopes[]'),
    skills: Optional[List[Skills]] = Query(None, title="Навыки", alias='skills[]')
):
    query = {
        'status': 'active',
        "$or": [
            {"description": {"$regex": query, "$options": "i"}},
            {"title": {"$regex": query, "$options": "i"}}
        ]
    }
    if scopes is not None:
        query["scope"] = {"$in": scopes}
    if skills is not None:
        query["skills"] = {"$in": skills}
    candidate = Users.find_one({"_id": candidate_id})
    vacancies = list(DetailedVacancies.aggregate(SEARCH_BY_CANDIDATE(query, candidate, page, limit)))
    if not len(vacancies):
        return {
            "total_pages": 0,
            "page": 0,
            "items": []
        }
    return vacancies[0]


@router.get(
    "/{vacancy_id}",
    name="Получить вакансию по _id вне зависимости от match",
    response_model=VacancyCandidateGet
)
async def get_vacancy_by_id(
    candidate_id: RequiredCandidateID,
    vacancy_id: OID,
):
    candidate = Users.find_one({"_id": candidate_id})
    vacancies = DetailedVacancies.aggregate(SEARCH_BY_ID(vacancy_id, candidate))
    if not len(vacancies):
        raise NOT_FOUND
    return vacancies[0]
