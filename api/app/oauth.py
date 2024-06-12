import jwt
from uuid import uuid4
from bson import ObjectId
from typing import Annotated
from fastapi.params import Depends
from fastapi import Request, Response
from datetime import datetime, timedelta, timezone
from cryptography.hazmat.primitives import serialization
from fastapi.security.utils import get_authorization_scheme_param

from app.database import Users
from app.settings import Settings
from app.exceptions import FILL_CANDIDATE, ONLY_CANDIDATE, ONLY_RECRUITER, UNATHORIZED

public_key = serialization.load_pem_public_key(open(Settings.JWT_PUBLIC_KEY_PATH).read().encode(), None)
private_key = serialization.load_pem_private_key(open(Settings.JWT_PRIVATE_KEY_PATH).read().encode(), None)


def require_refresh(request: Request) -> ObjectId:
    schema, token = get_authorization_scheme_param(request.cookies.get("refresh"))
    if not token or schema.lower() != "bearer":
        raise UNATHORIZED
    try:
        payload = jwt.decode(token, public_key, algorithms=[Settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise UNATHORIZED
    user_id, expiration = payload.get("sub"), payload.get("exp")
    if user_id is None or expiration is None:
        raise UNATHORIZED
    if datetime.fromtimestamp(expiration, tz=timezone.utc) < datetime.now(tz=timezone.utc):
        raise UNATHORIZED
    if not ObjectId.is_valid(user_id):
        raise UNATHORIZED
    return ObjectId(user_id)


def require_user(request: Request) -> ObjectId:
    schema, token = get_authorization_scheme_param(request.cookies.get("access"))
    if not token or schema.lower() != "bearer":
        raise UNATHORIZED
    try:
        payload = jwt.decode(token, public_key, algorithms=[Settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise UNATHORIZED
    user_id, expiration = payload.get("sub"), payload.get("exp")
    if user_id is None or expiration is None:
        raise UNATHORIZED
    if datetime.fromtimestamp(expiration, tz=timezone.utc) < datetime.now(tz=timezone.utc):
        raise UNATHORIZED
    if not ObjectId.is_valid(user_id):
        raise UNATHORIZED
    return ObjectId(user_id)


def create_tokens(user_id: str | ObjectId, response: Response) -> None:
    create_access_token(user_id, response)
    create_refresh_token(user_id, response)


def create_access_token(user_id: str | ObjectId, response: Response) -> None:
    expires_at = datetime.now(tz=timezone.utc) + timedelta(minutes=Settings.ACCESS_TOKEN_EXPIRES_IN)
    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": expires_at.timestamp()
        },
        key=private_key,
        algorithm=Settings.JWT_ALGORITHM
    )
    response.set_cookie(
        key="access",
        value=f"Bearer {token}",
        max_age=Settings.ACCESS_TOKEN_EXPIRES_IN,
        secure=True,
        httponly=True,
    )


def create_refresh_token(user_id: str | ObjectId, response: Response) -> None:
    expires_at = datetime.now(tz=timezone.utc) + timedelta(minutes=Settings.REFRESH_TOKEN_EXPIRES_IN)
    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": expires_at.timestamp(),
            "jti": str(uuid4())
        },
        key=private_key,
        algorithm=Settings.JWT_ALGORITHM
    )
    response.set_cookie(
        key="refresh",
        value=f"Bearer {token}",
        max_age=Settings.REFRESH_TOKEN_EXPIRES_IN,
        secure=True,
        httponly=True,
    )


def delete_tokens(response: Response):
    response.delete_cookie(
        key="access",
        secure=True,
        httponly=True,
        )
    response.delete_cookie(
        key="refresh",
        secure=True,
        httponly=True,
        )


RequiredUserID = Annotated[ObjectId, Depends(require_user)]


def require_candidate(user_id: RequiredUserID) -> ObjectId:
    if not Users.count_documents({"_id": user_id, "role": "candidate"}):
        raise ONLY_CANDIDATE
    return user_id


def require_filled_candidate(user_id: RequiredUserID) -> ObjectId:
    if not Users.count_documents({"_id": user_id, "role": "candidate", "filled": True}):
        raise FILL_CANDIDATE
    return user_id


def require_recruiter(user_id: RequiredUserID) -> ObjectId:
    if not Users.count_documents({"_id": user_id, "role": "recruiter"}):
        raise ONLY_RECRUITER
    return user_id


RequiredCandidateID = Annotated[ObjectId, Depends(require_candidate)]
RequiredRecruiterID = Annotated[ObjectId, Depends(require_recruiter)]
RequiredFilledCandidateID = Annotated[ObjectId, Depends(require_filled_candidate)]