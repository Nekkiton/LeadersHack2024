from typing import Any, List, Optional
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from pydantic_core import core_schema

from app.literals import Role


class OID(str):
    """
    Pydantic реализация ObjectId
    """
    @classmethod
    def __get_pydantic_core_schema__(
            cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


class Pagination(BaseModel):
    """
    Любой эндпоинт с пагинацией должен выглядеть так
    """
    total_pages: int
    page: int
    items: List[Any]


class BaseGet(BaseModel):
    """
    При получении любого предмета возвращается _id
    """
    id: OID = Field(alias="_id")


class UserGet(BaseGet):
    """
    Минимальные возвращаемые данные по пользователю
    """
    email: EmailStr
    role: Role
    password_changed_at: Optional[datetime] = None


class MatchItem(BaseModel):
    all: int = 0
    gte50: int = 0
    gte70: int = 0
    gte90: int = 0
