import math
from typing import List, Optional
from fastapi import APIRouter
from pymongo import DeleteMany, InsertOne, UpdateOne

from app.schemas import OID
from app.utils import get_now
from app.literals import Skills, VacancyStatus, WorkScopes
from app.oauth import RequiredRecruiterID
from app.database import Stages, Vacancies, DetailedVacancies

from .exceptions import VACANCY_DOESNT_BELONG_TO_RECRUIT
from .schemas import VacancyPost, VacancyResponse, PaginationVacanciesResponse, VacancyUpdate

router = APIRouter(tags=["Вакансии"], prefix="/vacancies")


@router.get(
    "/",
    name="Получить вакансии",
    response_model=PaginationVacanciesResponse
)
async def get_vacancies(
    page: int = 0,
    limit: int = 25,
    scope: Optional[WorkScopes] = None,
):
    query = {}
    if scope is not None:
        query["scope"] = scope
    return {
        "total_pages": DetailedVacancies.count_documents(query) // limit,
        "page": page,
        "items": DetailedVacancies.find(query).limit(limit).skip(page * limit)
    }


@router.get(
    "/for-recruiters",
    name="Вакансии рекрутера",
    response_model=PaginationVacanciesResponse
)
async def get_recruiter_vacancies(
    recruiter_id: RequiredRecruiterID,
    page: int = 0,
    limit: int = 25,
    query: str = "",
    statuses: Optional[List[VacancyStatus]] = None,
    skills: Optional[List[Skills]] = None

):
    query = {
        "recruiter_id": recruiter_id,
        "or": [
            {"description": {"$regex": query}},
            {"title": {"$regex": query}}
        ]
    }
    if statuses is not None:
        query["status"] = {"$in": statuses}
    if skills is not None:
        query["skills"] = {"$in": skills}
    return {
        "total_pages": DetailedVacancies.count_documents(query) // limit,
        "page": page,
        "items": DetailedVacancies.find(query).limit(limit).skip(page * limit)
    }


@router.post(
    "/",
    name="Создать вакансию",
    response_model=VacancyResponse
    )
async def create_vacancy(
    user_id: RequiredRecruiterID,
    payload: VacancyPost
    ):
    now = get_now()
    vacancy_dump = {
        **payload.model_dump(exclude="stages"),
        "recruiter_id": user_id,
        "created_at": now,
        "updated_at": now,
        "status": "active",
    }
    vacancy_result = Vacancies.insert_one(vacancy_dump)
    stages_dumps = []
    for stage in payload.stages:
        stages_dumps.append(
            {
                **stage.model_dump(),
                "vacancy_id": vacancy_result.inserted_id,
                "created_at": now,
                "updated_at": now,
            }
        )
    Stages.insert_many(stages_dumps)
    return DetailedVacancies.find_one({"_id": vacancy_result.inserted_id})


@router.put(
    "/{vacancy_id}",
    name="Обновить вакансию",
    response_model=VacancyResponse
    )
async def update_vacancy(
    user_id: RequiredRecruiterID,
    vacancy_id: OID,
    payload: VacancyUpdate
    ):
    now = get_now()
    vacancy_dump = {
        **payload.model_dump(exclude="stages"),
        "recruiter_id": user_id,
        "created_at": now,
        "updated_at": now,
        "status": "active",
    }
    vacancy_result = Vacancies.update_one(
        {
            "_id": vacancy_id,
            "recruiter_id": user_id,
        },
        {
            "$set": vacancy_dump
        }
        )
    if not vacancy_result.modified_count:
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    stage_ids = [stage.id for stage in payload.stages if stage.id is not None]
    bulk_operations = [DeleteMany({"vacancy_id": vacancy_id, "_id": {"$nin": stage_ids}})]
    for stage in payload.stages:
        stage_dump = {
            **stage.model_dump(),
            "updated_at": now,
        }
        if stage.id is not None:
            opertaion = UpdateOne(
                {
                    "_id": stage.id,
                    "vacancy_id": vacancy_id,
                },
                {
                    "$set": stage_dump
                }
            )
        else:
            opertaion = InsertOne(
                {
                    **stage_dump,
                    "vacancy_id": vacancy_id,
                    "created_at": now,
                }
            )
        bulk_operations.append(opertaion)
    Stages.bulk_write(bulk_operations)
    return DetailedVacancies.find_one({"_id": vacancy_id})


@router.get(
    "/{vacancy_id}",
    name="Получить вакансию",
    response_model=VacancyResponse,
    )
async def get_vacancy(vacancy_id: OID):
    return DetailedVacancies.find_one({"_id": vacancy_id})


@router.patch(
    "/{vacancy_id}/status",
    name="Обновить статус вакансии",
    response_model=VacancyResponse
    )
async def update_vacancy_status(
    user_id: RequiredRecruiterID,
    vacancy_id: OID,
    status: VacancyStatus
    ):
    update_result = Vacancies.update_one(
        {
            "_id": vacancy_id, 
            "recruiter_id": user_id
        },
        {
            "$set": { 
                "status": status
            }
        }
    )
    if not update_result:
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    return DetailedVacancies.find_one({"_id": vacancy_id})
