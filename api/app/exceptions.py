from fastapi import HTTPException, status


UNATHORIZED = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Войдите в приложение")
NOT_FOUND = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Объект не найден")