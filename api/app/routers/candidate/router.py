from fastapi import APIRouter

from app.database import Users
from app.exceptions import ALREADY_COMPLETE, BAD_OLD_PASSWORD
from app.routers.candidate.schemas import CandidateUpdate
from app.schemas import CandidateResponse, CandidatePost
from app.oauth import RequiredCandidateID, RequiredUserID
from app.utils import get_now, hash_password, validate_password

router = APIRouter(tags=["Соискатель"], prefix="/candidate")


@router.post(
    "/self",
    name="Заполнить пользователя как соискателя",
    response_model=CandidateResponse
    )
async def complete_as_candidate(
    user_id: RequiredUserID,
    payload: CandidatePost
    ):
    user = Users.find_one_and_update(
        {
            "_id": user_id,
            "role": {"$exists": 0}
        },
        {
            "$set": {
                **payload.__dict__,
                "updated_at": get_now(),
                "role": "candidate"
            }
        }
    )
    if not user:
        raise ALREADY_COMPLETE
    return user


@router.get(
    "/self",
    name="Получить себя",
    response_model=CandidateResponse
    )
async def get_self_candidate(user_id: RequiredCandidateID):
    return Users.find_one({"_id": user_id})


@router.patch(
    "/self",
    name="Обновить себя",
    response_model=CandidateResponse
    )
async def update_self_candidate(user_id: RequiredCandidateID, payload: CandidateUpdate):
    user = Users.find_one({"_id": user_id})
    update_data = {
        **payload.model_dump(exclude_unset=True, exclude_none=True, exclude={'old_password', 'new_password'}),
        "updated_at": get_now()
    }
    if payload.old_password:
        if not validate_password(payload.old_password, user["password"]):
            raise BAD_OLD_PASSWORD
        update_data["password"] = hash_password(payload.new_password)
    return Users.find_one_and_update({"_id": user_id}, {"$set": update_data})
