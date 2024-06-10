from datetime import timedelta
from random import randbytes
from bson import ObjectId
from typing import Annotated
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, Response

from app.utils import get_now
from app.database import Users
from app.exceptions import EMAIL_ALREADY_USED
from app.utils import validate_password, hash_password
from app.schemas import CandidateResponse, UserResponse
from app.oauth import create_access_token, create_tokens, require_refresh, delete_tokens

from .exceptions import INCORRECT_EMAIL_OR_PASSWORD, INVALID_TOKEN
from .schemas import LoginRequest, RegisterRequest, ResetPasswordRequest, ForgotPasswordRequest

router = APIRouter(tags=["Аутентификация"])


@router.post(
    "/login",
    name="Вход",
    description="Возвращает рекрутера или соискателя в зависимости от роли",
    response_model=CandidateResponse | UserResponse
    )
async def login(payload: LoginRequest, response: Response):
    user = Users.find_one({"email": payload.email})
    if user is None or not validate_password(payload.password, user["password"]):
        raise INCORRECT_EMAIL_OR_PASSWORD
    create_tokens(user["_id"], response)
    return user


@router.post(
    "/registration",
    name="Регистрация",
    description="После регистрации пользователь автоматически входит в аккаунт",
    response_model=UserResponse
    )
async def registration(payload: RegisterRequest,  response: Response):
    payload.password = hash_password(payload.password)
    user_insert_data = {
        **payload.__dict__,
        "created_at": get_now(),
        "updated_at": get_now(),
        "role": "candidate",
        "filled": False,
    }
    try:
        inserted_id = Users.insert_one(user_insert_data).inserted_id
    except DuplicateKeyError:
        raise EMAIL_ALREADY_USED
    create_tokens(inserted_id, response)
    return {
        "_id": inserted_id,
        **user_insert_data,
    }


@router.post(
    "/forgot-password",
    name="Запросить письмо для восстановления пароля",
    description="Пока письмо не отправляется, токен = \"12345\"",
    status_code=200,
)
async def forgot_password(payload: ForgotPasswordRequest):
    token = randbytes(32).hex()
    Users.update_one(
        {
            "email": payload.email,
        },
        {
            "$set": {
                "password_reset": {
                    "token": token,
                    "expires_at": get_now() + timedelta(minutes=60),
                }
            }
        }
    )
    # todo Здесь должно отправляться письмо на почту с ссылкой на восстановление пароля, а не возвращаться
    return token


@router.post(
    "/reset-password",
    name="Восстановить пароль",
    description="После восстановления пароля пользователь автоматически входит в аккаунт",
    response_model=CandidateResponse | UserResponse
    )
async def reset_password(
    payload: ResetPasswordRequest, 
    response: Response
    ):
    user = Users.find_one_and_update(
        {
            "email": payload.email,
            "password_reset.token": payload.token,
            "password_reset.expires_at": {"$gte": get_now()}
        },
        {
            "$set": {
                "password": hash_password(payload.password),
                "updated_at": get_now(),
            },
            "$unset": {
                "password_reset": 1
            }
        }
    )
    if not user:
        raise INVALID_TOKEN
    create_tokens(user["_id"], response)
    return user


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
