import math
from typing import List, Optional
from fastapi import APIRouter, Query
from pymongo import DeleteMany, InsertOne, UpdateMany, UpdateOne

from app.schemas import OID
from app.utils import get_now
from app.oauth import RequiredRecruiterID
from app.literals import VacancyStatus, WorkScopes
from app.exceptions import VACANCY_DOESNT_BELONG_TO_RECRUIT
from app.database import DetailedVacancies, Responses, Stages, Vacancies
from app.schemas.vacancies import VacanciesGet, VacancyGet, VacancyPost, VacancyUpdate


router = APIRouter(prefix="/vacancies")


@router.get(
    "/",
    name="Мои вакансии",
    response_model=VacanciesGet
)
async def get_recruiter_vacancies(
    recruiter_id: RequiredRecruiterID,
    page: int = Query(0, title="Страница"),
    limit: int = Query(25, title="Элементов на странице"),
    query: Optional[str] = Query("", title="Поиск по названиям, описаниям"),
    statuses: Optional[List[VacancyStatus]] = Query(None, title="Статусы", alias='statuses[]'),
    scopes: Optional[List[WorkScopes]] = Query(None, title="Направления", alias='scopes[]'),
):
    query = {
        "recruiter_id": recruiter_id,
        "$or": [
            {"description": {"$regex": query, "$options": "i"}},
            {"title": {"$regex": query, "$options": "i"}}
        ]
    }
    if statuses is not None:
        query["status"] = {"$in": statuses}
    if scopes is not None:
        query["scope"] = {"$in": scopes}
    return {
        "total_pages": math.ceil(DetailedVacancies.count_documents(query) / limit),
        "page": page,
        "items": DetailedVacancies.find(query).limit(limit).skip(page * limit)
    }


@router.post(
    "/",
    name="Создать вакансию",
    response_model=VacancyGet
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
                "status": "active",
                "created_at": now,
                "updated_at": now,
            }
        )
    Stages.insert_many(stages_dumps)
    return DetailedVacancies.find_one({"_id": vacancy_result.inserted_id})


@router.put(
    "/{vacancy_id}",
    name="Обновить вакансию",
    response_model=VacancyGet
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
    bulk_operations = [UpdateMany({"vacancy_id": vacancy_id, "_id": {"$nin": stage_ids}}, {"$set": {"status": "archived"}})]
    for stage in payload.stages:
        stage_dump = {
            **stage.model_dump(),
            "updated_at": now,
            "status": "active"
        }
        if stage.id is not None:
            opertaion = UpdateOne(
                {
                    "_id": stage.id,
                    "vacancy_id": vacancy_id,
                },
                {
                    "$set": stage_dump,
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


@router.patch(
    "/{vacancy_id}/status",
    name="Обновить статус вакансии",
    response_model=VacancyGet
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
                "status": status,
                "updated_at": get_now()
            }
        }
    )
    if not update_result:
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    if status == "closed":
        Responses.update_many(
            {
                "vacancy_id": vacancy_id,
                "status": {"$nin": ["approved", "rejected"]}
            },
            {
                "$set": {
                    "status": "rejected"
                },
                "$push": {
                    "messages": {
                        "sender_role": "recruiter",
                        "type": "result",
                        "text": "Вакансия закрылась",
                        "timestamp": get_now()
                    }
                }
            }
        )
    return DetailedVacancies.find_one({"_id": vacancy_id})
