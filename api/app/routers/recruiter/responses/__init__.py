from typing import Optional
from fastapi import APIRouter

from app.schemas import OID
from app.utils import get_now
from app.oauth import RequiredRecruiterID
from app.database import DetailedResponses, Responses, Stages, Vacancies
from app.schemas.responses import RecruiterResponseAnswer, Response, ResponsesGet
from app.exceptions import ONE_RESPONSE_FOR_ONE_VACACNY, RESPONSE_NOT_ACTIVE_OR_NOT_FOUND, VACANCY_DOESNT_BELONG_TO_RECRUIT

from .aggregations import PAGINATED_MATCH_RESPONSES

router = APIRouter(prefix="/responses")


@router.get(
    "/",
    name="Получить отклики на мои вакансии",
    response_model=ResponsesGet
)
async def get_responses(
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
    result = list(DetailedResponses.aggregate(PAGINATED_MATCH_RESPONSES(page, limit)))
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


@router.post(
    "/",
    name="Создать отклик",
    response_model=Response,
    )
async def create_response(
    recruiter_id: RequiredRecruiterID,
    candidate_id: OID,
    vacancy_id: OID,
    message: str
):
    if Responses.count_documents({"vacancy_id": vacancy_id, "candidate_id": candidate_id}):
        raise ONE_RESPONSE_FOR_ONE_VACACNY
    if not Vacancies.count_documents({"_id": vacancy_id, "recruiter_id": recruiter_id, "status": "active"}):
        raise VACANCY_DOESNT_BELONG_TO_RECRUIT
    stage = list(Stages.find({"vacancy_id": vacancy_id, "status": "active"}, sort={"position": 1}))[1]
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
        ],
        "created_at": get_now(),
        "updated_at": get_now()
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
    recruiter_id: RequiredRecruiterID,
    response_id: OID,
    payload: RecruiterResponseAnswer,
):
    now = get_now()
    response = DetailedResponses.find_one({"_id": response_id, "vacancy.recruiter_id": recruiter_id, "status": {"$nin": ["approved", "rejected"]}})
    if response is None:
        raise RESPONSE_NOT_ACTIVE_OR_NOT_FOUND
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
        next_stage = Stages.find_one({"position": {"$gt": curr_stage["position"]}, "status": "active", "vacancy_id": response["vacancy"]["_id"]}, {"_id": 1})
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
            "$set": {"status": status, "stage_id": stage_id, "updated_at": get_now()},
            "$push": {"messages": message}
        },
        return_document=True
    )


@router.post(
    "/{response_id}/commentary",
    name="Оставить комментарий по отклику",
    response_model=Response
)
async def leave_response_comment(
    recruiter_id: RequiredRecruiterID,
    response_id: OID,
    comment: str
):
    response = DetailedResponses.find_one({"_id": response_id, "vacancy.recruiter_id": recruiter_id})
    if response is None:
        raise RESPONSE_NOT_ACTIVE_OR_NOT_FOUND
    Responses.update_one(
        {
            "response_id": response_id,
        },
        {
            "$set": {
                "comment": comment,
                "updated_at": get_now()
            }
        }
    )
    return {
        **response,
        "comment": comment,
        "updated_at": get_now()
    } 
