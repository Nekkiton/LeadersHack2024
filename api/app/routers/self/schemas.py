from pydantic import BaseModel, Field

class PasswordUpdate(BaseModel):
    old_password: str = Field(title="Старый пароль")
    new_password: str = Field(title="Новый пароль")


class Preferences(BaseModel):
    email_notify: bool = False
