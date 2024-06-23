from datetime import datetime, timedelta
from pydantic import BaseModel, model_validator
from typing import List, Literal, Optional, Self

from app.utils import get_now
from app.schemas.candidates import CandidateGet
from app.literals import ResponseMessageType, ResponseStatus, Role

from .vacancies import VacancyGet
from . import OID, BaseGet, MatchItem, Pagination


class ResponseMessageItem(BaseModel):
    type: ResponseMessageType
    sender_role: Role
    text: str
    created_at: datetime
    stage_id: Optional[OID] = None
    meet_at: Optional[datetime] = None
    meet_on: Optional[str] = None
    meet_url: Optional[str] = None
    interview_timestamp: Optional[datetime] = None


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
    meet_on: Optional[Literal["zoom", "googlemeet", "telemost"]] = None

    @model_validator(mode="after")
    def check_fields_by_status(self: Self) -> Self:
        if self.status == "reject" and self.message is None:
            raise ValueError("Если статус reject, необходим message")
        if self.meet_at is not None and self.meet_at < get_now() + timedelta(hours=1):
            raise ValueError("Назначить интервью можно минимум за час до его проведения")
        return self


class CandidateSimpleResponseAnswer(BaseModel):
    message: str


class RecruiterResponseAnswer(BaseModel):
    status: Literal["approve", "reject"]
    message: str


class RecruiterSimpleResponseAnswer(BaseModel):
    message: str
