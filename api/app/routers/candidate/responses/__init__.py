from fastapi import APIRouter

from app.exceptions import NOT_FOUND
from app.utils import get_now
from app.schemas import OID
from app.literals import Role
from app.oauth import RequiredCandidateID
from app.database import DetailedResponses, Responses, Stages
from app.schemas.responses import CandidateResponseAnswer, Response, ResponsesGet

router = APIRouter(prefix="/responses")


@router.get(
    "/",
    name="Получить отклики кандидата",
    response_model=ResponsesGet,
)
async def get_responses(
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
    "/",
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


@router.post(
    "/{response_id}",
    name="Ответить на отклик",
    response_model=Response
)
async def answer_response(
    candidate_id: RequiredCandidateID,
    response_id: OID,
    payload: CandidateResponseAnswer
):
    # todo Проверка, находится ли возвращаемое время во временных слотах рекрутера
    now = get_now()
    response = Responses.find_one({"_id": response_id, "candidate_id": candidate_id})
    if response is None:
        raise NOT_FOUND
    if payload.status == "reject":
        status = 'rejected'
        message = {
            "type": "result",
            "sender_role": "candidate",
            "text": payload.message,
            "created_at": now,
            "stage_id": response["stage_id"]
        }
    else:
        if response["status"] != "waiting_for_candidate":
            raise NOT_FOUND
        url = "https://www.google.com"
        status = "waiting_for_recruiter"
        message = {
            "type": "candidate_answer",
            "sender_role": "candidate",
            "text": f"Интервью назначено на {payload.meet_at.strftime("%d.%m %H:%M")}. Ссылка на интервью: {url}",
            "created_at": now,
            "stage_id": response["stage_id"],
            "meet_on": payload.meet_on,
            "meet_url": url,
            "meet_at": payload.meet_at,
        }
    return Responses.find_one_and_update(
        {
            "_id": response_id
        },
        {
            "$set": {"status": status},
            "$push": {"messages": message}
        },
        return_document=True
    )
