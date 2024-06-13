from fastapi import HTTPException, status

ONE_RESPONSE_FOR_ONE_VACACNY = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Нельзя оставить больше одного отклика на одну вакансию"
)