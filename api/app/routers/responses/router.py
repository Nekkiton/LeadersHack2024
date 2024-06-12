from fastapi import APIRouter

from app.exceptions import NOT_FOUND
from app.routers.responses.schemas import VacancyResponse
from app.schemas import OID
from app.utils import get_now
from app.database import Responses, Stages
from app.oauth import RequiredCandidateID


router = APIRouter(tags=["Отклики"], prefix="/responses")


@router.post(
    "/candidate/",
    name="Создать отклик",
    response_model=VacancyResponse
    )
async def create_response(
    candidate_id: RequiredCandidateID,
    vacancy_id: OID,
    message: str
):
    # todo Проверка один отклик от кандидата на вакансию
    stage = Stages.find_one({"vacancy_id": vacancy_id}, sort={"position": 1})
    if stage is None:
        raise NOT_FOUND
    stage_id = stage.get("_id")
    insert_data = {
        "status": "waiting_for_recruiter",
        "vacancy_id": vacancy_id,
        "candidate_id": candidate_id,
        "stage_id": stage_id,
        "messages": [
            {
                "type": "candidate_request",
                "sender_role": "candidate",
                "text": message,
                "created_at": get_now(),
                "stage_id": stage_id
            }
        ]
    }
    result = Responses.insert_one(insert_data)
    return {
        "_id": result.inserted_id,
        **insert_data
    }
