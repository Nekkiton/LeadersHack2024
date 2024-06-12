from fastapi import APIRouter

from app.literals import Role
from app.exceptions import NOT_FOUND
from app.routers.responses.schemas import CandidateResponseAnswer, Response, ResponsesVacanciesGet
from app.schemas import OID
from app.utils import get_now
from app.database import DetailedResponses, Responses, Stages
from app.oauth import RequiredCandidateID

router = APIRouter(tags=["Отклики"], prefix="/responses")


@router.post(
    "/candidate/",
    name="Создать отклик",
    response_model=Response
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
        "inviter": "candidate",
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


@router.get(
    "/candidate/",
    name="Получить отклики кандидата",
    response_model=ResponsesVacanciesGet,
)
async def get_candidate_responses(
    candidate_id: RequiredCandidateID,
    page: int = 0,
    limit: int = 25,
    inviter: Role = "candidate",
):
    query = {
        "candidate_id": candidate_id, 
        "inviter": inviter
    }
    total_pages = DetailedResponses.count_documents(query) // limit
    items = DetailedResponses.find(query).skip(page * limit).limit(limit)
    return {
        "total_pages": total_pages,
        "page": page,
        "items": items
    }
    

@router.post(
    "/candidate/{response_id}",
    name="Ответить на отклик",
    response_model=Response
)
async def answer_candidate_response(
    candidate_id: RequiredCandidateID,
    response_id: OID,
    payload: CandidateResponseAnswer
):
    # todo Проверка, находится ли возвращаемое время во временных слотах рекрутера
    now = get_now()
    response = Responses.find_one({"_id": response_id, "candidate_id": candidate_id, "status": "waiting_for_candidate"})
    if response is None:
        raise NOT_FOUND
    if payload.status == "reject":
        status = payload.status
        message = {
            "type": "result",
            "sender_role": "candidate",
            "text": payload.message,
            "created_at": now,
            "stage_id": response["stage_id"]
        }
    else:
        status = 'waiting_for_recruiter'
        message = {
            "type": "candidate_answer",
            "sender_role": "candidate",
            "text": payload.message,
            "created_at": now,
            "stage_id": response["stage_id"],
            "meet_on": payload.meet_on,
            "meet_url": "https://www.google.com",
            "meet_at": payload.meet_at,
        }
    Responses.update_one(
        {
            "_id": response_id
        },
        {
            "$set": {"status": status},
            "$push": {"messages": message}
        }
    )

