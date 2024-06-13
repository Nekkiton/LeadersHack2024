from typing import List, Optional
from fastapi import APIRouter, Query

from app.schemas import OID
from app.exceptions import NOT_FOUND
from app.database import Users, Vacancies
from app.oauth import RequiredRecruiterID
from app.literals import Skills, WorkExperiences
from app.schemas.candidates import CandidateGet, CandidatesGet, CandidatesMatchGet

from .aggregations import USERS_BY_FIO, USERS_MATCH_BY_VACANCY

router = APIRouter(prefix="/candidates")

@router.get(
    "/",
    name="Получить всех соискателей",
    response_model=CandidatesGet
    )
async def get_candidates_via_filters(
    _: RequiredRecruiterID,
    fio: str = "",
    experience: Optional[List[WorkExperiences]] = Query(None, alias="experience[]"),
    skills: Optional[List[Skills]] = Query(None, alias="skills[]"),
    page: int = 0,
    limit: int = 25
):
    query = {
        "fio": {"$regex": fio, "$options": "i"},
        "role": "candidate"
    }
    if experience is not None:
        query["experience"] = {"$in": experience}
    if skills is not None:
        query["skills"] = {"$in": skills}
    result = list(Users.aggregate(USERS_BY_FIO(query, page, limit)))
    if not len(result):
        return {
            "total_pages": 0,
            "page": 0,
            "items": []
        }
    return result[0]


@router.get(
    "/by-vacancy",
    name="Получить всех кандидатов для рекрутера по вакансии",
    response_model=CandidatesMatchGet
)
async def get_candidates_via_vacancy(
    recruiter_id: RequiredRecruiterID,
    vacancy_id: OID,
    page: int = 0,
    limit: int = 25
):
    vacancy = Vacancies.find_one({"_id": vacancy_id, "recruiter_id": recruiter_id})
    if vacancy is None:
        raise NOT_FOUND
    result = list(Users.aggregate(USERS_MATCH_BY_VACANCY(vacancy, page, limit)))
    if not len(result):
        return {
            "total_pages": 0,
            "page": 0,
            "items": []
        }
    return result[0]


@router.get(
    "/{candidate_id}",
    name="Получить кандидата (с комментарием)",
    response_model=CandidateGet
)
async def get_candidate(
    recruiter_id: RequiredRecruiterID,
    candidate_id: OID,
):
    return


@router.get(
    "/{candidate_id}",
    name="Создать комментарий для кандидата",
    response_model=CandidateGet
)
async def get_candidate(
    recruiter_id: RequiredRecruiterID,
    candidate_id: OID,
    comment: str
):
    return