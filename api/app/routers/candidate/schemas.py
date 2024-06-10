from pydantic import Field, model_validator
from typing import Optional, Self

from api.app.schemas import CandidatePost
from api.app.utils import optional


class CandidateUpdate(optional(CandidatePost)):
    old_password: Optional[str] = Field(title="Старый пароль", min_length=8)
    new_password: Optional[str] = Field(title="Новый пароль", min_length=8)

    @model_validator(mode="after")
    def both_fields_or_none_of(self) -> Self:
        old = self.old_password
        new = self.new_password
        if old is None != new is None:
            raise ValueError("Нужны либо оба поля old_password и new_password, либо ни одно из них")
        return self
