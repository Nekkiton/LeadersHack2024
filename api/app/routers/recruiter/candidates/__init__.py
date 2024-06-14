from typing import List, Optional
from fastapi import APIRouter, Query

from app.schemas import OID
from app.exceptions import NOT_FOUND
from app.oauth import RecruiterId
from app.literals import Skills, WorkExperiences
from app.schemas.responses import ResponseMinGet
from app.database import DetailedResponses, Users, Vacancies
from app.schemas.candidates import CandidatesGet, CandidatesMatchGet, CandidateGet

from .aggregations import USERS_BY_FIO, USERS_MATCH_BY_VACANCY

router = APIRouter(prefix="/candidates")

@router.get(
    "/",
    name="Получить всех соискателей",
    response_model=CandidatesGet
    )
async def get_candidates_via_filters(
    _: RecruiterId,
    fio: str = "",
    experience: Optional[List[WorkExperiences]] = Query(None, alias="experience[]"),
    skills: Optional[List[Skills]] = Query(None, alias="skills[]"),
    page: int = 0,
    limit: int = 25
):
    query = {
        "fio": {"$regex": fio, "$options": "i"},
        "role": "candidate",
        "filled": True
    }
    if experience is not None:
        query["work_experience"] = {"$in": experience}
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
    recruiter_id: RecruiterId,
    vacancy_id: OID,
    page: int = 0,
    limit: int = 25,
):
    vacancy = Vacancies.find_one({"_id": vacancy_id, "recruiter_id": recruiter_id})
    if vacancy is None:
        raise NOT_FOUND
    result = list(Users.aggregate(USERS_MATCH_BY_VACANCY(vacancy, page, limit)))
    if not len(result):
        return {
            "match": {
                "all": 0,
                "gte50": 0,
                "gte70": 0,
                "gte90": 0,
            },
            "total_pages": 0,
            "page": 0,
            "items": []
        }
    return result[0]


@router.get(
    "/{candidate_id}",
    name="Получить кандидата",
    response_model=CandidateGet
)
async def get_candidate(
    _: RecruiterId,
    candidate_id: OID
):
    return Users.find_one({"_id": candidate_id, "role": "candidate", "filled": True})


@router.get(
    "/{candidate_id}/history",
    name="История откликов кандидата",
    response_model=List[ResponseMinGet]
)
async def get_candidate_history(
    _: RecruiterId,
    candidate_id: OID,
):
    return list(DetailedResponses.find({"candidate_id": candidate_id, "filled": True}))
