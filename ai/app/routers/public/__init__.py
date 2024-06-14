import json
from fastapi import APIRouter, UploadFile
from app.ai import parse_cv

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
