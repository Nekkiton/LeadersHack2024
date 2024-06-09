from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel


def get_now() -> datetime:
    """
    Короткое получение времени
    """
    return datetime.now(tz=timezone.utc)


def basemodel_to_dict(value: BaseModel) -> dict:
    """
    Рекурсивно преобразовывает BaseModel в словарь, включая все уровни вложенности BaseModel.
    В случаях, когда BaseModel не вложенный, лучше использовать BaseModel.__dict__
    """
    result = value.__dict__
    for key in result:
        if isinstance(result[key], BaseModel):
            result[key] = basemodel_to_dict(result[key])
        elif isinstance(result[key], list) and all(isinstance(item, BaseModel) for item in result[key]):
            result[key] = [basemodel_to_dict(item) for item in result[key]]
    return result