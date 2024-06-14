from datetime import datetime, timezone
from typing import Literal
import bcrypt


def get_now() -> datetime:
    """
    Короткое получение времени
    """
    return datetime.now(tz=timezone.utc)


def hash_password(password: str) -> str:
    """
    Хэширует пароль
    """
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def validate_password(password: str, hashed_password: str) -> bool:
    """
    Сверяет обычный пароль с хэшированным
    """
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


def get_meet_url(platform: Literal["telemost", "googlemeet", "zoom"], date: datetime) -> str:
    match platform:
        case "telemost":
            return ""
        case "googlemeet":
            return ""
        case "zoom":
            return ""
