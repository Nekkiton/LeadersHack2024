from typing import Annotated
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, Response
from app.oauth import create_tokens, require_user
from app.database import Users
from app.exceptions import NOT_FOUND

from .schemas import Login, ApplicantInsert, RecruiterInsert
from .exceptions import INCORRECT_EMAIL_OR_PASSWORD, EMAIL_ALREADY_EXISTS
from .utils import validate_password, hash_password

router = APIRouter(tags=["Аутентификация"])

@router.post(
    "/login",
    name="Вход",
    )
async def login(
    payload: Login, 
    response: Response
    ):
    user = Users.find_one({"email": payload.email}, {"password"})
    if user is None or not validate_password(payload.password, user["password"]):
        raise INCORRECT_EMAIL_OR_PASSWORD
    access, refresh = create_tokens(user.id, response)
    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": user
    }


@router.post(
    "/registration",
    name="Регистрация",
    )
async def registration(
    payload: RecruiterInsert | ApplicantInsert, 
    response: Response
    ):
    try:
        payload.password = hash_password(payload.password)
        user_id = Users.insert_one(payload.__dict__).inserted_id
    except DuplicateKeyError:
        raise EMAIL_ALREADY_EXISTS
    access, refresh = create_tokens(user_id, response)
    user = Users.find_one({"_id": user_id}, {"password": 0})
    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": user,
    }


@router.get("/self")
async def get_self(
    user_id: Annotated[ObjectId, Depends(require_user)]
):
    user = Users.find_one({"_id": user_id})
    if not user:
        raise NOT_FOUND
    return user
