from bson import ObjectId
from fastapi import FastAPI
from datetime import datetime
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth.router import router as Authentication
from app.routers.user.router import router as User
from app.routers.common.router import router as Common
from app.routers.vacancies.router import router as Vacancies
from app.routers.responses.router import router as Responses
from app.settings import Settings

ENCODERS_BY_TYPE[ObjectId] = lambda x: str(x)
ENCODERS_BY_TYPE[datetime] = lambda x: x.isoformat()

app = FastAPI(
    title="LeadersHack2024 API",
    version="0.0.6",
    root_path="/api",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[Settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Authentication)
app.include_router(User)
app.include_router(Vacancies)
app.include_router(Responses)
app.include_router(Common)
