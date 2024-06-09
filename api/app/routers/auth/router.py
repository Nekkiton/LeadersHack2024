from bson import ObjectId
from typing import Annotated
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, Response

from app.utils import basemodel_to_dict, get_now
from app.database import Users
from app.oauth import create_access_token, create_tokens, require_refresh, delete_tokens

from .utils import validate_password, hash_password
from .schemas import Login, RecruiterPost, RecruiterResponse
from .exceptions import INCORRECT_EMAIL_OR_PASSWORD, EMAIL_ALREADY_EXISTS

router = APIRouter(tags=["Аутентификация"])


@router.post(
    "/login/recruiter",
    name="Вход для рекрутера",
    response_model=RecruiterResponse
    )
async def login(payload: Login, response: Response):
    user = Users.find_one({"email": payload.email, "role": "recruiter"})
    if user is None or not validate_password(payload.password, user["password"]):
        raise INCORRECT_EMAIL_OR_PASSWORD
    create_tokens(user["_id"], response)
    return user


@router.post(
    "/registration/recruiter",
    name="Регистрация для рекрутера",
    response_model=RecruiterResponse
    )
async def registration(payload: RecruiterPost,  response: Response):
    payload.password = hash_password(payload.password)
    user_insert_data = {
        **basemodel_to_dict(payload),
        "created_at": get_now(),
        "updated_at": get_now(),
        "role": "recruiter"
    }
    try:
        inserted_id = Users.insert_one(user_insert_data).inserted_id
    except DuplicateKeyError:
        raise EMAIL_ALREADY_EXISTS
    create_tokens(inserted_id, response)
    return {
        "_id": inserted_id,
        **user_insert_data,
    }


@router.post(
    "/refresh",
    name="Обновить токен доступа",
    status_code=200
    )
async def refresh(
    user_id: Annotated[ObjectId, Depends(require_refresh)],
    response: Response
    ):
    create_access_token(user_id, response)


@router.post(
    "/logout",
    name="Выйти",
    status_code=200
    )
async def logout(response: Response):
    delete_tokens(response)
