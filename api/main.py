from dotenv import load_dotenv
print(load_dotenv('.env.local'))

from bson import ObjectId
from fastapi import FastAPI
from datetime import datetime
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as Auth
from app.routers.self import router as Self
from app.routers.public import router as Public
from app.routers.candidate import router as Candidate
from app.routers.recruiter import router as Recruiter

from app.settings import Settings

ENCODERS_BY_TYPE[ObjectId] = lambda x: str(x)
ENCODERS_BY_TYPE[datetime] = lambda x: x.isoformat()

app = FastAPI(
    title="LeadersHack2024 API",
    version="0.0.7",
    root_path="/api",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[Settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Auth)
app.include_router(Self)
app.include_router(Public)
app.include_router(Candidate)
app.include_router(Recruiter)
