from fastapi import APIRouter

from api.app.database import Users
from api.app.exceptions import ALREADY_COMPLETE
from api.app.schemas import CandidateResponse, CandidatePost
from api.app.oauth import RequiredCandidateID, RequiredUserID
from api.app.utils import get_now

router = APIRouter()


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

