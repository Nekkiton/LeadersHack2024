from fastapi import HTTPException, status

ARTICLE_NOT_BELONGS_TO_RECRUITER = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Новость не принадлежит рекрутеру"
    )