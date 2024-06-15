from datetime import date, datetime, timedelta, timezone, MINYEAR
from typing import List, get_args
from fastapi import UploadFile
from bson import ObjectId
from requests import post
import bcrypt

from app.settings import Settings
from app.database import Tasks, Users
from app.schemas.candidates import CandidatePartial
from app.literals import Educations, WorkTypes, WorkExperiences, WorkSchedules, Skills


def get_now() -> datetime:
    """
    Короткое получение времени
    """
    return datetime.now(tz=timezone.utc)


def hash_password(password: str) -> str:
    """
    Хэширует пароль
    """
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def validate_password(password: str, hashed_password: str) -> bool:
    """
    Сверяет обычный пароль с хэшированным
    """
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


async def analyze_candidate_cv(file: UploadFile) -> CandidatePartial | None:
    def parse_date(val: str | None, format: str):
        if not val: return None
        try:
            return datetime.strptime(val, format)
        except ValueError:
            return

    files = {'file': (file.filename, await file.read(), file.content_type)}
    res = post(
        url=f'{Settings.AI_URL}/public/parse-cv',
        files=files,
    )

    if res.status_code != 200:
        return None

    try:
        data = res.json()

        skills = []
        for i in data.get("skills", []):
            if i in get_args(Skills) and len(skills) <= 9:
                skills.append(i)

        work_history = []
        for i in data.get('work_history', []):
            work_history.append({
                **i,
                "start_date": parse_date(i.get("start_date"), "%m.%Y"),
                "end_date": parse_date(i.get("end_date"), "%m.%Y"),
            })

        salary_expectation = None
        try:
            salary_expectation = int(data.get('salary_expectation'))
        except:
            pass
            
        return {
            **data,
            "birthday": parse_date(data.get("birthday"), "%d.%m.%Y"),
            "education": data["education"] if data.get("education") in get_args(Educations) else None,
            "work_schedule": data["work_schedule"] if data.get("work_schedule") in get_args(WorkSchedules) else "5/2",
            "work_type": data["work_type"] if data.get("work_type") in get_args(WorkTypes) else "Удаленно",
            "work_experience": data["work_experience"] if data.get("work_experience") in get_args(WorkExperiences) else None,
            "work_history": work_history,
            "skills": skills,
            "salary_expectation": salary_expectation,
        }
    except:
        return None


def schedule_meeting(
    response_id: ObjectId,
    recruiter_id: ObjectId, 
    candidate_id: ObjectId, 
    platform: str,
    at: datetime,
    ):
    Tasks.insert_one(
        {
            "type": "meeting",
            "body": {
                "response_id": response_id,
                "recruiter_id": recruiter_id,
                "candidate_id": candidate_id,
                "platform": platform
            },
            "meet_at": at,  
            "execute_at": at - timedelta(minutes=30),
            "status": "pending"
        }
    )
    for _id in [recruiter_id, candidate_id]:
        schedule_notification(
            _id,
            title="Запланирована встреча",
            content=f"В {(at + timedelta(hours=3)).strftime("%d.%m.%y %H:%M")}",
            )


def schedule_notification(
    user_id: ObjectId,
    title: str,
    content: str,
    execute_at: datetime = datetime(year=MINYEAR, month=1, day=1)
    ):
    """
    Создание уведомления
    """
    Tasks.insert_one(
        {
            "type": "notification",
            "body": {
                "user_id": user_id,
                "title": title,
                "content": content,
            },
            "exceute_at": execute_at,
            "status": "pending"
        }
    )


def get_available_timeslots(recruiter_id: ObjectId, at: datetime | date) -> List[datetime]:
    """
    Возвращает список доступных слотов рекрутера в конкретную дату
    """
    if isinstance(at, datetime):
        at = at.date()
    recruiter = Users.find_one({"_id": recruiter_id, "role": "recruiter"})
    slots = []
    for slot in recruiter["interview_slots"]:
        start_time = slot["start_time"].time()
        end_time = slot["end_time"].time()
        slot = start_time
        while slot < end_time:
            slots.append(slot)
            slot += timedelta(minutes=30)
    datetimes = []
    for slot in slots:
        datetimes.append(datetime.combine(at, slot))
    scheduled = Tasks.find({"type": "meeting", "meet_at": {"$in": datetimes}}, {"meet_at"})
    for schedule in list(scheduled):
        datetimes.remove(schedule["meet_at"])
    return datetimes
