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