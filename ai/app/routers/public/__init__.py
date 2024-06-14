import json
from typing import get_args
from fastapi import APIRouter, UploadFile
from app.ai import parse_cv, process_vacancy
from app.schemas.vacancies import VacancyPartial
from app.literals import WorkSchedules, WorkExperiences, WorkTypes, WorkScopes, Skills

router = APIRouter(tags=["Публичное"], prefix="/public")

@router.post(
    "/parse-cv",
    name="Преобразовать данные из файла с резюме",
)
async def analyse_candidate_cv(file: UploadFile):
    cv = parse_cv(file)
    json_cv = json.loads(cv)
    json_cv['education'] = json_cv['education'][0]['degree']
    return json_cv


@router.post(
    "/process-vacancy",
    name="Преобразовать данные вакансии",
)
async def process_vacanсy(vacancy: VacancyPartial):
    vacancy = process_vacancy(vacancy)
    json_vacancy = json.loads(vacancy)

    json_vacancy['work_schedule'] = json_vacancy['work_schedule'] if json_vacancy['work_schedule'] in get_args(WorkSchedules) else "5/2"
    json_vacancy['work_type'] = json_vacancy['work_type'] if json_vacancy['work_type'] in get_args(WorkTypes) else "Удаленно"
    json_vacancy['work_experience'] = json_vacancy['work_experience'] if json_vacancy['work_experience'] in get_args(WorkExperiences) else "Нет опыта"
    if json_vacancy['skills'] is not None:
        json_vacancy['skills'] = [skill for skill in json_vacancy['skills'] if skill in get_args(Skills)]

    return json_vacancy