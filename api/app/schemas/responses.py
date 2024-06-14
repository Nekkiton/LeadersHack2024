from datetime import datetime
from typing import List, Literal, Optional, Self
from pydantic import BaseModel, Field, model_validator

from app.schemas.candidates import CandidateGet
from app.literals import ResponseMessageType, ResponseStatus, Role

from . import OID, BaseGet, MatchItem, Pagination
from .vacancies import VacancyGet


class ResponseMessageItem(BaseModel):
    type: ResponseMessageType
    sender_role: Role
    text: str
    created_at: datetime
    stage_id: Optional[OID] = None
    meet_at: Optional[datetime] = None
    meet_on: Optional[str] = None
    meet_url: Optional[str] = None


class Response(BaseGet):
    status: ResponseStatus
    vacancy_id: OID
    candidate_id: OID
    stage_id: OID
    inviter: Role
    comment: Optional[str] = None
    messages: List[ResponseMessageItem]
    created_at: datetime


class ResponseMinGet(Response):
    vacancy: VacancyGet
    match: int


class ResponseGet(Response):
    vacancy: VacancyGet
    candidate: CandidateGet
    match: int


class ResponsesGet(Pagination):
    match: Optional[MatchItem] = None
    items: List[ResponseGet]


class CandidateResponseAnswer(BaseModel):
    status: Literal["approve", "reject"]
    message: Optional[str] = None
    meet_at: Optional[datetime] = None
    meet_on: Optional[Literal["Zoom", "GoogleMeet", "Telemost"]] = None

    @model_validator(mode="after")
    def check_fields_by_status(self) -> Self:
        if self.status == "reject" and self.message is None:
            raise ValueError("Если статус reject, необходим message")
        return self


class RecruiterResponseAnswer(BaseModel):
    status: Literal["approve", "reject"]
    message: str
