from fastapi import HTTPException, status

UNATHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Войдите в приложение",
    headers={"WWW-Authenticate": "Bearer"},
    )

NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, 
    detail="Объект не найден",
    )

ONLY_CANDIDATE = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Только соискателю доступно это действие"
)

ONLY_RECRUITER = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Только рекрутеру доступно это действие"
)

ALREADY_COMPLETE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Пользователь уже заполнен"
)

BAD_OLD_PASSWORD = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Неверный старый пароль"
)
