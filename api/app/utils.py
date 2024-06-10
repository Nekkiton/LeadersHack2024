from pydantic import BaseModel, create_model
from datetime import datetime, timezone
from typing import Optional, Type
import bcrypt


def get_now() -> datetime:
    """
    Короткое получение времени
    """
    return datetime.now(tz=timezone.utc)


def optional(source: Type[BaseModel]) -> Type[BaseModel]:
    """
    Делает все поля класса опциональными
    """
    fields = {field: (Optional[type_], None) for field, type_ in source.__annotations__.items()}
    return create_model(source.__name__, **fields)


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
