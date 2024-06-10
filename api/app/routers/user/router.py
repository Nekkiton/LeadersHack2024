from fastapi import APIRouter
from pymongo.errors import DuplicateKeyError

from app.utils import get_now, hash_password, validate_password
from app.database import Users
from app.oauth import RequiredCandidateID, RequiredUserID
from app.exceptions import BAD_OLD_PASSWORD, EMAIL_ALREADY_USED
from app.schemas import CandidateResponse, CandidatePost, UserResponse

from .schemas import PasswordUpdate

router = APIRouter(tags=["Пользователь"], prefix="/user")



@router.get(
    "/",
    name="Получить себя",
    response_model=CandidateResponse | UserResponse
)
async def get_self(user_id: RequiredUserID):
    return Users.find_one({"_id": user_id})


@router.put(
    "/password",
    name="Обновить пароль",
    status_code=200
)
async def update_self_password(user_id: RequiredUserID, payload: PasswordUpdate):
    user = Users.find_one({"_id": user_id}, {"password": 1})
    if not validate_password(payload.old_password, user["password"]):
        raise BAD_OLD_PASSWORD
    Users.update_one({"_id": user_id}, {"$set": {"password": hash_password(payload.new_password)}})


@router.put(
    "/candidate",
    name="Заполнить соискателя",
    description="В случае, если пользователь уже заполнен, обновляет данные",
    response_model=CandidateResponse
    )
async def fill_as_candidate(
    user_id: RequiredCandidateID,
    payload: CandidatePost
    ):
    try:
        user = Users.find_one_and_update(
            {
                "_id": user_id,
            },
            {
                "$set": {
                    **payload.__dict__,
                    "updated_at": get_now(),
                    "filled": True,
                },
            }
        )
    except DuplicateKeyError:
        raise EMAIL_ALREADY_USED
    return user
