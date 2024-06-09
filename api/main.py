from bson import ObjectId
from fastapi import FastAPI
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth.router import router as Authentication

ENCODERS_BY_TYPE[ObjectId] = lambda x: str(x)

app = FastAPI(
    title="LeadersHack2024 API",
    version="0.0.1",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Authentication)
