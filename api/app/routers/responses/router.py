from typing import Optional
from fastapi import APIRouter
from pymongo import ReturnDocument

from app.literals import Role
from app.exceptions import NOT_FOUND
from app.schemas import OID
from app.utils import get_now
from app.database import DetailedResponses, Responses, Stages
from app.oauth import RequiredCandidateID, RequiredRecruiterID

from .schemas import CandidateResponseAnswer, RecruiterResponseAnswer, Response, ResponsesGet

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
    response_model=ResponsesGet,
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
    name="Ответить на отклик для соискателя",
    response_model=Response
)
async def answer_candidate_response(
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
        status = payload.status
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
        status = "waiting_for_recruiter"
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
    return Responses.find_one_and_update(
        {
            "_id": response_id
        },
        {
            "$set": {"status": status},
            "$push": {"messages": message}
        },
        return_document=ReturnDocument.AFTER
    )


@router.get(
    "/recruiter/",
    name="Получить отклики для рекрутера",
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
    "/recruiter/{response_id}",
    name="Ответить на отклик для рекрутера",
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
        status = payload.status
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
            status = "approve"
            message = {
                "type": "next_stage_request",
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
        return_document=ReturnDocument.AFTER
    )
