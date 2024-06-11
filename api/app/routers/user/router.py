from fastapi import APIRouter
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from app.database import Users
from app.oauth import RequiredCandidateID, RequiredUserID, RequiredRecruiterID
from app.exceptions import BAD_OLD_PASSWORD, EMAIL_ALREADY_USED
from app.utils import get_now, hash_password, validate_password
from app.schemas import CandidateResponse, CandidatePost, UserResponse, \
                        RecruiterResponse, RecruiterPost

from .schemas import PasswordUpdate

router = APIRouter(tags=["Пользователь"], prefix="/user")



@router.get(
    "/",
    name="Получить себя",
    response_model=CandidateResponse | RecruiterResponse | UserResponse
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
                    **payload.model_dump(),
                    "updated_at": get_now(),
                    "filled": True,
                }
            },
            return_document=ReturnDocument.AFTER
        )
    except DuplicateKeyError:
        raise EMAIL_ALREADY_USED
    return user


@router.put(
    "/recruiter",
    name="Заполнить рекрутера",
    description="В случае, если пользователь уже заполнен, обновляет данные",
    response_model=RecruiterResponse,
    )
async def fill_as_recruiter(
    user_id: RequiredRecruiterID,
    payload: RecruiterPost,
    ):
    try:
        user = Users.find_one_and_update(
            {
                "_id": user_id,
            },
            {
                "$set": {
                    **payload.model_dump(),
                    "updated_at": get_now(),
                    "filled": True,
                }
            },
            return_document=ReturnDocument.AFTER
        )
    except DuplicateKeyError:
        raise EMAIL_ALREADY_USED
    return user
