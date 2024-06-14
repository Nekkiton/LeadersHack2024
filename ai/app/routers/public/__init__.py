import json
from typing import List
from pydantic import ValidationError
from fastapi import APIRouter, UploadFile
from app import literals
from app.schemas.candidates import CandidatePartial
from app.ai import parse_cv

router = APIRouter(tags=["Публичное"], prefix="/public")

@router.post(
    "/parse-cv",
    name="Преобразовать данные из файла с резюме",
    response_model=CandidatePartial | None
)
async def analyse_candidate_cv(file: UploadFile):

    cv = parse_cv(file)

    json_cv = json.loads(cv)
    json_cv['education'] = json_cv['education'][0]['degree']

    try:
        #CandidatePartial.model_validate_json(json_cv) # keep it commented to see console error for now
        return json_cv
    except ValidationError as e:
        return None