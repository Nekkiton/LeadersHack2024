from fastapi import APIRouter

from app.utils import get_now
from app.database import News
from app.schemas.news import PaginatedNews


router = APIRouter(prefix="/news")

@router.get(
    "/",
    name="Мои новости",
    response_model=PaginatedNews
    )
async def get_articles(
    page: int = 0,
    limit: int = 10
    ):
    return {
        "total_pages": News.count_documents({"publication_date": {"$lte": get_now()}}) // limit,
        "page": page,
        "items": list(News.find({"publication_date": {"$lte": get_now()}}, sort={"publcation_date": -1}).skip(page * limit).limit(limit))
    }
