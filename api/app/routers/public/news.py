import math
from fastapi import APIRouter

from app.schemas import OID
from app.utils import get_now
from app.database import News
from app.schemas.news import PaginatedNews, NewsItemGet


router = APIRouter(prefix="/news")

@router.get(
    "/",
    name="Получить новости",
    response_model=PaginatedNews
    )
async def get_articles(
    page: int = 0,
    limit: int = 10
    ):
    return {
        "total_pages": math.ceil(News.count_documents({"publication_date": {"$lte": get_now()}}) / limit),
        "page": page,
        "items": list(News.find({"publication_date": {"$lte": get_now()}}, sort={"publication_date": -1}).skip(page * limit).limit(limit))
    }


@router.get(
    "/{article_id}",
    name="Получить новость",
    response_model=NewsItemGet,
)
async def get_article(article_id: OID):
    return News.find_one({"_id": article_id, "publication_date": {"$lte": get_now()}})
