from fastapi import FastAPI
from datetime import datetime
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware

from app.routers.public import router as Public

ENCODERS_BY_TYPE[datetime] = lambda x: x.isoformat()

app = FastAPI(
    title="LeadersHack2024 AI API",
    version="1.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["ai.leaders-gb.ru", "leaders-gb.ru"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Public)