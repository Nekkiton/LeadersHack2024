import json
from fastapi import APIRouter, UploadFile
from app.ai import parse_cv, process_vacancy
from app.schemas.vacancies import VacancyPartial

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
    "/process-vacanсy",
    name="Преобразовать данные вакансии",
)
async def process_vacanсy(vacancy: VacancyPartial):
    vacancy = process_vacancy(vacancy)
    json_vacancy = json.loads(vacancy)
    return json_vacancy