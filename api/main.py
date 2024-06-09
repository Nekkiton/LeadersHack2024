from datetime import datetime
from bson import ObjectId
from fastapi import FastAPI
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth.router import router as Authentication
from app.settings import Settings

ENCODERS_BY_TYPE[ObjectId] = lambda x: str(x)
ENCODERS_BY_TYPE[datetime] = lambda x: x.isoformat()

app = FastAPI(
    title="LeadersHack2024 API",
    version="0.0.2",
    #root_path="/api",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[Settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Authentication)
