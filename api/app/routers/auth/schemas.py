from pydantic import EmailStr, Field, BaseModel


class LoginRequest(BaseModel):
    """
    Форма для логина
    """
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """
    Форма для регистрации
    """
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    """
    Форма для запроса на восстановление пароля
    """
    email: EmailStr = Field(title="Почта")


class ResetPasswordRequest(BaseModel):
    """
    Форма для восстановления пароля
    """
    token: str
    email: EmailStr
    password: str
