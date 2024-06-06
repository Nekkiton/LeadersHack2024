import jwt
from uuid import uuid4
from bson import ObjectId
from pydantic import BaseModel
from app.settings import Settings
from app.exceptions import UNATHORIZED
from fastapi import Depends, Request, Response, Cookie
from datetime import datetime, timedelta, timezone
from cryptography.hazmat.primitives import serialization
from fastapi.security import HTTPBearer, OAuth2PasswordBearer


oauth_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
security = HTTPBearer(description="Вставьте access_token в это поле")
public_key = serialization.load_pem_public_key(Settings.JWT_PUBLIC_KEY.encode(), None)
private_key = serialization.load_pem_private_key(Settings.JWT_PRIVATE_KEY.encode(), None)


def create_tokens(user_id: str | ObjectId, response: Response) -> tuple[str, str]:
    access = create_access_token(user_id, response)
    refresh = create_refresh_token(user_id, response)
    return access, refresh


def require_user(request: Request) -> ObjectId:
    if not request.cookies.get("lh2024a"):
        raise UNATHORIZED
    try:
        payload = jwt.decode(request.cookies.get("lh2024a"), Settings.JWT_PUBLIC_KEY, algorithms=[Settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        expiration = payload.get("exp")
        if user_id is None or expiration is None or expiration < datetime.now(tz=timezone.utc):
            raise UNATHORIZED
    except jwt.PyJWTError:
        raise UNATHORIZED
    return ObjectId(user_id)


def create_access_token(user_id: str | ObjectId, response: Response) -> str:
    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=Settings.ACCESS_TOKEN_EXPIRES_IN)
        },
        key=private_key,
        algorithm=Settings.JWT_ALGORITHM
    )
    response.set_cookie(
        key="lh2024a",
        value=f"Bearer {token}",
        max_age=Settings.ACCESS_TOKEN_EXPIRES_IN,
        secure=True,
        httponly=True,
        samesite="lax"
    )
    return token


def create_refresh_token(user_id: str | ObjectId, response: Response) -> str:
    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=Settings.REFRESH_TOKEN_EXPIRES_IN),
            "jti": str(uuid4())
        },
        key=private_key,
        algorithm=Settings.JWT_ALGORITHM
    )
    response.set_cookie(
        key="lh2024r",
        value=f"Bearer {token}",
        max_age=Settings.REFRESH_TOKEN_EXPIRES_IN,
        secure=True,
        httponly=True,
        samesite="lax"
    )
    return token
