from fastapi import HTTPException, status

VACANCY_DOESNT_BELONG_TO_RECRUIT = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Вакансия не существует или не принадлежит рекрутеру"
)