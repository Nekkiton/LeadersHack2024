from fastapi import APIRouter
from app import literals


router = APIRouter(tags=["Словари и прочее"], prefix="/common")


@router.get(
    "/educations",
    )
async def get_educations():
    return literals.Education.__dict__.get("__args__")


@router.get(
    "/work-scopes"
    )
async def get_work_scopes():
    return literals.WorkScopes.__dict__.get("__args__")


@router.get(
    "/work-schedules"
    )
async def get_work_schedules():
    return literals.WorkSchedule.__dict__.get("__args__")


@router.get(
    "/work-experiences"
)
async def get_work_experiences():
    return literals.WorkExperience.__dict__.get("__args__")


@router.get(
    "/cities"
)
async def get_cities():
    return literals.Cities.__dict__.get("__args__")


@router.get(
    "/work-types"
)
async def get_work_types():
    return literals.WorkType.__dict__.get("__args__")


@router.get(
    "/skills"
)
async def get_skills():
    return literals.Skills.__dict__.get("__args__")
