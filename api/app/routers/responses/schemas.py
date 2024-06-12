from typing import List
from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas import OID, Pagination
from app.routers.vacancies.schemas import VacancyGet
from app.literals import ResponseMessageType, ResponseStatus, Role


class ResponseMessageItem(BaseModel):
    type: ResponseMessageType
    sender_role: Role
    text: str
    created_at: datetime
    stage_id: OID


class Response(BaseModel):
    id: OID = Field(alias="_id")
    status: ResponseStatus
    vacancy_id: OID
    candidate_id: OID
    stage_id: OID
    inviter: Role
    messages: List[ResponseMessageItem]
    

class ResponseVacancyGet(Response):
    vacancy: VacancyGet


class ResponsesVacanciesGet(Pagination):
    items: List[ResponseVacancyGet]
