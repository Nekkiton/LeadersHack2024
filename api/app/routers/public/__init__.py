from typing import List
from fastapi import APIRouter
from app import literals

from .vacancies import router as Vacancies
from .news import router as News

router = APIRouter(tags=["Публичное"], prefix="/public")
router.include_router(Vacancies)
router.include_router(News)

@router.get(
    "/educations",
    name="Словарь образований",
    response_model=List[str]
    )
async def get_educations():
    return literals.Educations.__dict__.get("__args__")


@router.get(
    "/work-scopes",
    name="Словарь направлений",
    response_model=List[str]
    )
async def get_work_scopes():
    return literals.WorkScopes.__dict__.get("__args__")


@router.get(
    "/work-schedules",
    name="Словарь расписаний",
    response_model=List[str]
    )
async def get_work_schedules():
    return literals.WorkSchedules.__dict__.get("__args__")


@router.get(
    "/work-experiences",
    name="Словарь опыта",
    response_model=List[str]
)
async def get_work_experiences():
    return literals.WorkExperiences.__dict__.get("__args__")


@router.get(
    "/cities",
    name="Словарь городов",
    response_model=List[str]
)
async def get_cities():
    return literals.Cities.__dict__.get("__args__")


@router.get(
    "/work-types",
    name="Словарь форматов работы",
    response_model=List[str]
)
async def get_work_types():
    return literals.WorkTypes.__dict__.get("__args__")


@router.get(
    "/skills",
    name="Словарь навыков",
    response_model=List[str]
)
async def get_skills():
    return literals.Skills.__dict__.get("__args__")
