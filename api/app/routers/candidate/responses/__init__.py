import math
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter

from app.utils import get_now, schedule_meeting
from app.schemas import OID
from app.literals import Role
from app.oauth import FilledCandidateId
from app.exceptions import ONE_RESPONSE_FOR_ONE_VACACNY, TIMESLOT_ALREADY_OCCUPIED
from app.database import DetailedResponses, Responses, Stages, Tasks, Users, Vacancies
from app.schemas.responses import CandidateResponseAnswer, Response, ResponsesGet, ResponseGet
from app.exceptions import NOT_FOUND, REQUIRED_PARAMS_MISSING, RESPONSE_NOT_ACTIVE_OR_NOT_FOUND, VACANCY_NOT_ACTIVE

from .aggregations import DAYS_WITH_INTERVIEWS

router = APIRouter(prefix="/responses")


@router.get(
    "/",
    name="Получить отклики кандидата",
    response_model=ResponsesGet,
)
async def get_responses(
    candidate_id: FilledCandidateId,
    page: int = 0,
    limit: int = 25,
    inviter: Role = "candidate",
):
    query = {
        "candidate_id": candidate_id, 
        "inviter": inviter
    }
    total_pages = math.ceil(DetailedResponses.count_documents(query) / limit)
    items = DetailedResponses.find(query, sort={"updated_at": -1}).skip(page * limit).limit(limit)
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
    candidate_id: FilledCandidateId,
    vacancy_id: OID,
    message: str
):
    if Responses.count_documents({"vacancy_id": vacancy_id, "candidate_id": candidate_id}):
        raise ONE_RESPONSE_FOR_ONE_VACACNY
    if not Vacancies.count_documents({"_id": vacancy_id, "status": "active"}):
        raise VACANCY_NOT_ACTIVE
    stage = Stages.find_one({"vacancy_id": vacancy_id, "status": "active"}, sort={"position": 1})
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
        ],
        "created_at": get_now(),
        "updated_at": get_now()
    }
    result = Responses.insert_one(insert_data)
    return {
        "_id": result.inserted_id,
        **insert_data
    }


@router.get(
    "/by-vacancy",
    name="Получить отклик по вакансии",
    response_model=Optional[ResponseGet]
    )
async def get_response(
    candidate_id: FilledCandidateId,
    vacancy_id: OID,
):
    return DetailedResponses.find_one({"vacancy_id": vacancy_id, "candidate_id": candidate_id})


@router.get(
    "/{response_id}",
    name="Получить отклик",
    response_model=Optional[ResponseGet]
)
async def get_response_by_id(
    candidate_id: FilledCandidateId,
    response_id: OID
):
    return DetailedResponses.find_one({"_id": response_id, "candidate_id": candidate_id})


@router.post(
    "/{response_id}",
    name="Ответить на отклик",
    response_model=Response
)
async def answer_response(
    candidate_id: FilledCandidateId,
    response_id: OID,
    payload: CandidateResponseAnswer
):
    # TODO Проверка, находится ли возвращаемое время во временных слотах рекрутера
    now = get_now()
    response = DetailedResponses.find_one({"_id": response_id, "candidate_id": candidate_id, "status": {"$nin": ["approved", "rejected"]}})
    if response is None:
        raise RESPONSE_NOT_ACTIVE_OR_NOT_FOUND
    recruiter_id = response["vacancy"]["recruiter_id"]
    if Tasks.count_documents({"$or": [{"body.recruiter_id": recruiter_id}, {"body.candidate_id": candidate_id}], "meet_at": payload.meet_at}):
        raise TIMESLOT_ALREADY_OCCUPIED
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
        curr_stage = Stages.find_one({"_id": response["stage_id"]}, {"position": 1})
        prev_stage = Stages.find_one({
                "position": {"$lt": curr_stage["position"]}, 
                "vacancy_id": response["vacancy_id"],
                "status": "active"
            },
            sort={"position": -1}
            )        
        auto_interview = prev_stage["auto_interview"]
        status = "waiting_for_recruiter"
        if auto_interview:
            if payload.meet_on is None or payload.meet_at is None:
                raise REQUIRED_PARAMS_MISSING("meet_on, meet_at")
            schedule_meeting(
                response["_id"],
                recruiter_id,
                response["candidate_id"],
                payload.meet_on, 
                payload.meet_at,
                response["vacancy"]["title"]
                )
            message = {
                "type": "candidate_answer",
                "sender_role": "candidate",
                # TODO: deal with timezone not only Moscow
                "text": f"Интервью назначено на {(payload.meet_at + timedelta(hours=3)).strftime("%d.%m.%y %H:%M")}.",
                "created_at": now,
                "stage_id": response["stage_id"],
            }
        else:
            message = {
                "type": "candidate_answer",
                "sender_role": "candidate",
                "text": f"Приглашение принято",
                "created_at": now,
                "stage_id": response["stage_id"],
            }
    return Responses.find_one_and_update(
        {
            "_id": response_id
        },
        {
            "$set": {"status": status, "updated_at": get_now()},
            "$push": {"messages": message}
        },
        return_document=True
    )


@router.get(
    "/{response_id}/schedule",
    name="Расписание по отклику",
    response_model=List[datetime]
    )
async def get_response_schedule(
    _: FilledCandidateId,
    response_id: OID,
    end: datetime,
    ):
    # Возвращаем отклики рекрутера на час позже реального времени, 
    # чтобы ограничить возможность назначать интервью слишком рано
    # TODO: deal with all timezones
    # now it only works with utc+3 as fast decision for prototype

    # start = get_now() + timedelta(hours=1)
    moscow_tz = timezone(timedelta(hours=3))
    start = datetime.now(tz=moscow_tz)
    response = DetailedResponses.find_one({"_id": response_id})
    recruiter = Users.find_one({"_id": response["vacancy"]["recruiter_id"]})
    max_interviews = recruiter["interview_per_day"]
    # recruiter_tz = recruiter.get("preferences", {}).get("timezone", "+03")
    # recruiter_tzinfo = timezone(timedelta(hours=int(recruiter_tz)))
    slots = set()
    for slot in recruiter["interview_slots"]:
        start_time = slot["start_time"].astimezone(tz=moscow_tz) + timedelta(hours=3)
        end_time = slot["end_time"].astimezone(tz=moscow_tz) + timedelta(hours=3)
        while start_time < end_time:
            slots.add(start_time.time())
            start_time += timedelta(minutes=30)
    # scheduled = Tasks.aggregate(DAYS_WITH_INTERVIEWS(recruiter["_id"], start, end, recruiter_tz))
    scheduled = Tasks.aggregate(DAYS_WITH_INTERVIEWS(recruiter["_id"], start, end, '+03:00'))
    scheduled_zip = {}
    if scheduled:
        scheduled_zip = {schedule["_id"]: schedule for schedule in list(scheduled)}
    start = start.astimezone(tz=moscow_tz) - timedelta(days=1)
    end = end.astimezone(tz=moscow_tz)
    # start = start.astimezone(tz=recruiter_tzinfo) - timedelta(days=1)
    # end = end.astimezone(tz=recruiter_tzinfo)
    result = []
    while start <= end:
        start += timedelta(days=1)
        scheduled = scheduled_zip.get(str(start.date()))
        day_slots = slots.copy()
        if scheduled:
            if scheduled["interviews"] >= max_interviews:
                continue
            for slot in scheduled['slots']:
                day_slots.remove((slot + timedelta(hours=3)).time())
            # day_slots.difference_update(set(scheduled["slots"]))
        result += [datetime.combine(start, slot) for slot in day_slots]
    # return result
    return map(lambda i: i.astimezone(tz=timezone.utc), result)
