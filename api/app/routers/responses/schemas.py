from datetime import datetime
from typing import List, Literal, Optional, Self
from pydantic import BaseModel, Field, model_validator

from app.schemas import OID, Pagination
from app.routers.vacancies.schemas import VacancyGet
from app.literals import ResponseMessageType, ResponseStatus, Role


class ResponseMessageItem(BaseModel):
    type: ResponseMessageType
    sender_role: Role
    text: str
    created_at: datetime
    stage_id: OID
    meet_at: Optional[datetime] = None
    meet_on: Optional[str] = None
    meet_url: Optional[str] = None


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


class CandidateResponseAnswer(BaseModel):
    status: Literal["approve", "reject"]
    message: Optional[str] = None
    meet_at: Optional[datetime] = None
    meet_on: Optional[Literal["Zoom", "GoogleMeet", "Telemost"]] = None

    @model_validator(mode="after")
    @classmethod
    def check_fields_by_status(self) -> Self:
        if self.status == "approve" and (self.meet_at is None or self.meet_on is None):
            raise ValueError("Если статус approve, необходимы meet_at и meet_on")
        elif self.status == "reject" and self.message is None:
            raise ValueError("Если статус reject, необходим message")
        return self


class RecruiterResponseAnswer(BaseModel):
    status: Literal["approve", "reject"]
    message: str