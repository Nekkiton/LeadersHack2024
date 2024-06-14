from fastapi import HTTPException, status

UNATHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Войдите в приложение",
    headers={"WWW-Authenticate": "Bearer"},
    )

NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, 
    detail="По запросу ничего не найдено",
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

EMAIL_ALREADY_USED = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Указанная почта уже занята другим пользователем"
    )

FILL_CANDIDATE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Пользователь не заполнен"
    )

ONE_RESPONSE_FOR_ONE_VACACNY = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Нельзя оставить больше одного отклика на одну вакансию"
    )

VACANCY_DOESNT_BELONG_TO_RECRUIT = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Вакансия не существует или не принадлежит рекрутеру"
    )

REQUIRED_PARAMS_MISSING = lambda param: HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail=f"Необходимые параметры отсутствуют: {param}"
    )

VACANCY_NOT_ACTIVE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Вакансия не активна"
    )

RESPONSE_NOT_ACTIVE_OR_NOT_FOUND = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Открытый отклик по запросу не найден"
    )

NOT_ADDED_YET = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="В разработке"
    )

NOT_ENOUGH_STAGES = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='В вакансии недостаточно этапов'
)

FAILED_CV_ANALYSIS = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Не удалось извлечь данные из резюме',
)
