from typing import List
from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas import OID
from app.literals import ResponseMessageType, ResponseStatus, Role


class VacancyResponseMessage(BaseModel):
    type: ResponseMessageType
    sender_role: Role
    text: str
    created_at: datetime
    stage_id: OID


class VacancyResponse(BaseModel):
    id: OID = Field(alias="_id")
    status: ResponseStatus
    vacancy_id: OID
    candidate_id: OID
    stage_id: OID
    messages: List[VacancyResponseMessage]
    