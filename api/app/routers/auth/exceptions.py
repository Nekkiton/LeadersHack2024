from fastapi import HTTPException, status

INCORRECT_EMAIL_OR_PASSWORD = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Пользователь не найден или неверный пароль. Проверьте правильно ли введены почта и пароль."
    )

INVALID_TOKEN = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Неверный токен или почта"
    )
