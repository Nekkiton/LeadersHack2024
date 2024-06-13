from fastapi import APIRouter

from .vacancies import router as Vacancies
from .responses import router as Responses


router = APIRouter(tags=["Кабинет соискателя"], prefix="/candidate")


router.include_router(Vacancies)
router.include_router(Responses)
