from datetime import datetime, timezone
from typing import Literal
from requests import get
import bcrypt

from app.settings import Settings
from app.exceptions import NOT_ADDED_YET


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
            response = get(
                url="https://cloud-api.yandex.net/v1/telemost-api/conferences",
                headers={"Authorization": "OAuth " + Settings.TELEMOST_API},
                json={"access_level": "PUBLIC",}
            )
            if response.status_code != 200:
                print(response.status_code, response.content.decode("utf-8"))
                return "Не удалось создать"
            return response.json().get("join_url", "Не удалось создать")
        case "googlemeet":
            raise NOT_ADDED_YET
        case "zoom":
            raise NOT_ADDED_YET
