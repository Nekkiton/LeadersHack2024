from fastapi import HTTPException, status

INCORRECT_EMAIL_OR_PASSWORD = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Пользователь не найден или неверный пароль. Проверьте правильно ли введены почта и пароль."
    )

EMAIL_ALREADY_EXISTS = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Пользователь с указанной почтой уже существует"
)