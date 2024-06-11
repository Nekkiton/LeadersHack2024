import math
from fastapi import APIRouter
from pymongo import DeleteMany, UpdateOne

from app.schemas import OID
from app.utils import get_now
from app.literals import VacancyStatus
from app.oauth import RequiredRecruiterID
from app.database import Stages, Vacancies, DetailedVacancies

from .exceptions import VACANCY_DOESNT_BELONG_TO_RECRUIT
from .schemas import VacancyPost, VacancyResponse, PaginationVacanciesResponse

router = APIRouter(tags=["Вакансии"], prefix="/vacancies")


@router.get(
    "/",
    name="Получить вакансии",
    response_model=PaginationVacanciesResponse
)
async def get_vacancies(
    page: int = 0,
    limit: int = 25
):
    total_pages = DetailedVacancies.count_documents({}) // limit
    items = DetailedVacancies.find().limit(limit).skip(page * limit)
    return {
        "total_pages": total_pages,
        "page": page,
        "items": items
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
):
    total_pages = DetailedVacancies.count_documents({"recruiter_id": recruiter_id}) // limit
    items = DetailedVacancies.find({"recruiter_id": recruiter_id}).limit(limit).skip(page * limit)
    return {
        "total_pages": total_pages,
        "page": page,
        "items": items
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
    bulk_operations = [DeleteMany({"vacancy_id": vacancy_id, "position": {"gt": max(payload.stages, lambda x: x.position)}})]
    for stage in payload.stages:
        bulk_operations.append(
            UpdateOne(
                {
                    "position": stage.position,
                    "vacancy_id": vacancy_id,
                },
                {
                    **stage.model_dump(),
                    "vacancy_id": vacancy_id,
                    "created_at": now,
                    "updated_at": now,
                },
                upsert=True
            )
        )
    Stages.bulk_write(bulk_operations)
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
