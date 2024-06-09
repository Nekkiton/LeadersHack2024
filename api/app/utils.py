from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel


def get_now() -> datetime:
    """
    Короткое получение времени
    """
    return datetime.now(tz=timezone.utc)
