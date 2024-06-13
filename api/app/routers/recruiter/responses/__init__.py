from typing import Optional
from fastapi import APIRouter

from app.schemas import OID
from app.utils import get_now
from app.oauth import RequiredRecruiterID
from app.database import DetailedResponses, Responses, Stages, Vacancies
from app.schemas.responses import RecruiterResponseAnswer, Response, ResponsesGet
from app.exceptions import NOT_FOUND, ONE_RESPONSE_FOR_ONE_VACACNY, VACANCY_DOESNT_BELONG_TO_RECRUIT

router = APIRouter(prefix="/responses")


@router.get(
    "/",
    name="Получить отклики на мои вакансии",
    response_model=ResponsesGet
)
async def get_recruiter_responses(
    recruiter_id: RequiredRecruiterID,
    page: int = 0,
    limit: int = 25,
    vacancy_id: Optional[OID] = None
):
    query = {
        "vacancy.recruiter_id": recruiter_id, 
    }
    if vacancy_id:
        query["vacancy_id"] = vacancy_id
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
    response_model=Response,
    )
async def creare_response_from_recruiter(
    recruiter_id: RequiredRecruiterID,
    candidate_id: OID,
    vacancy_id: OID,
    message: str
):
    if Responses.count_documents({"vacancy_id": vacancy_id, "candidate_id": candidate_id}):
        raise ONE_RESPONSE_FOR_ONE_VACACNY
    if not Vacancies.count_documents({"_id": vacancy_id, "recruiter_id": recruiter_id}):
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    stage = list(Stages.find({"vacancy_id": vacancy_id}, sort={"position": 1}))[1]
    stage_id = stage.get("_id")
    insert_data = {
        "status": "waiting_for_candidate",
        "vacancy_id": vacancy_id,
        "candidate_id": candidate_id,
        "stage_id": stage_id,
        "inviter": "recruiter",
        "messages": [
            {
                "type": "recruiter_request",
                "sender_role": "recruiter",
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
async def asnwer_recruiter_response(
    recruiter_id: RequiredRecruiterID,
    response_id: OID,
    payload: RecruiterResponseAnswer,
):
    now = get_now()
    response = DetailedResponses.find_one({"_id": response_id, "vacancy.recruiter_id": recruiter_id})
    if response is None:
        raise NOT_FOUND
    if payload.status == "reject":
        stage_id = response["stage_id"]
        status = 'rejected'
        message = {
            "type": "result",
            "sender_role": "recruiter",
            "text": payload.message,
            "created_at": now,
            "stage_id": stage_id
        }
    else:
        curr_stage = Stages.find_one({"_id": response["stage_id"]}, {"position": 1})
        next_stage = Stages.find_one({"position": {"$gt": curr_stage["position"]}, "vacancy_id": response["vacancy"]["_id"]}, {"_id": 1})
        if next_stage is not None:
            stage_id = next_stage["_id"]
            status = "waiting_for_candidate"
            message = {
                "type": "next_stage_request",
                "sender_role": "recruiter",
                "text": payload.message,
                "created_at": now,
                "stage_id": stage_id
            }
        else:
            stage_id = response["stage_id"]
            status = "approved"
            message = {
                "type": "result",
                "sender_role": "recruiter",
                "text": payload.message,
                "created_at": now,
                "stage_id": stage_id
            }
    return Responses.find_one_and_update(
        {
            "_id": response_id
        },
        {
            "$set": {"status": status, "stage_id": stage_id},
            "$push": {"messages": message}
        },
        return_document=True
    )