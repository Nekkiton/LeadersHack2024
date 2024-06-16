from fastapi import APIRouter

from .vacancies import router as Vacancies
from .responses import router as Responses
from .candidates import router as Candidates
from .news import router as News

router = APIRouter(tags=["Кабинет рекрутера"], prefix="/recruiter")

router.include_router(Vacancies)
router.include_router(Responses)
router.include_router(Candidates)
router.include_router(News)
