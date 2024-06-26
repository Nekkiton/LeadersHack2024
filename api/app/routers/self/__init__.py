from fastapi import APIRouter, UploadFile
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from app.utils import get_now
from app.database import Users
from app.schemas import UserGet, Preferences
from app.schemas.candidates import CandidateGet, CandidatePost, CandidatePartial
from app.schemas.recruiters import RecruiterGet, RecruiterPost
from app.exceptions import BAD_OLD_PASSWORD, EMAIL_ALREADY_USED, FAILED_CV_ANALYSIS
from app.utils import get_now, hash_password, validate_password, analyze_candidate_cv
from app.oauth import CandidateId, UserId, RecruiterId

from .schemas import PasswordUpdate
from .notifications import router as Notifications

router = APIRouter(tags=["Пользователь"], prefix="/self")
router.include_router(Notifications)

@router.get(
    "/",
    name="Получить себя",
    response_model=CandidateGet | RecruiterGet | UserGet | None
)
async def get_self(user_id: UserId):
    return Users.find_one({"_id": user_id})


@router.put(
    "/password",
    name="Обновить пароль",
    status_code=200
)
async def update_self_password(user_id: UserId, payload: PasswordUpdate):
    user = Users.find_one({"_id": user_id}, {"password": 1})
    if not validate_password(payload.old_password, user["password"]):
        raise BAD_OLD_PASSWORD
    Users.update_one({"_id": user_id}, {
        "$set": {
            "password": hash_password(payload.new_password),
            "password_changed_at": get_now(),
        },
    })


@router.put(
    "/candidate",
    name="Заполнить соискателя",
    description="В случае, если пользователь уже заполнен, обновляет данные",
    response_model=CandidateGet
    )
async def fill_as_candidate(
    user_id: CandidateId,
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


@router.post(
    "/candidate/via-file",
    name="Получить данные соискателя из файла",
    response_model=CandidatePartial
)
async def analyse_candidate_cv(
    _: CandidateId,
    file: UploadFile
):
    result = await analyze_candidate_cv(file)
    if not result:
        raise FAILED_CV_ANALYSIS
    return result


@router.put(
    "/recruiter",
    name="Заполнить рекрутера",
    description="В случае, если пользователь уже заполнен, обновляет данные",
    response_model=RecruiterGet,
    )
async def fill_as_recruiter(
    user_id: RecruiterId,
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


@router.put(
    "/preferences",
    name="Обновить настройки пользователя",
    response_model=CandidateGet | RecruiterGet | UserGet | None
    )
async def update_preferences(
    user_id: UserId,
    payload: Preferences,
    ):
    return Users.find_one_and_update({"_id": user_id}, {"$set": {"preferences": payload.model_dump()}}, return_document=True)
