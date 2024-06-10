from fastapi import APIRouter

from app.schemas import OID
from app.utils import get_now
from app.database import Vacancies
from app.oauth import RequiredRecruiterID

from .exceptions import VACANCY_DOESNT_BELONG_TO_RECRUIT
from .schemas import VacancyPost, VacancyResponse

router = APIRouter(tags=["Вакансии"], prefix="/vacancies")


@router.post(
    "/",
    name="Создать вакансию",
    response_model=VacancyResponse
    )
async def create_vacancy(
    user_id: RequiredRecruiterID,
    payload: VacancyPost
):
    result = Vacancies.insert_one(
        {
            **payload.model_dump(),
            "created_at": get_now(),
            "updated_at": get_now(),
            "recruiter_id": user_id,
        }
    )
    return Vacancies.find_one({"_id": result.inserted_id})


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
    vacancy = Vacancies.update_one(
        {
            "_id": vacancy_id,
            "recruiter_id": user_id,
        },
        {
            **payload.model_dump(),
            "updated_at": get_now(),
        }
    )
    if vacancy is None:
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    return vacancy


@router.delete(
    "/{vacancy_id}",
    name="Удалить вакансию",
    status_code=200
)
async def delete_vacancy(
    user_id: RequiredRecruiterID,
    vacancy_id: OID
):
    result = Vacancies.delete_one({"_id": vacancy_id, "recruiter_id": user_id})
    if not result.deleted_count:
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
