import math
from fastapi import APIRouter, status

from app.schemas import OID
from app.database import News
from app.oauth import RecruiterId
from app.schemas.news import NewsItemGet, NewsItemPost, PaginatedNews

from .exceptions import ARTICLE_NOT_BELONGS_TO_RECRUITER

router = APIRouter(prefix="/news")


@router.get(
    "/",
    name="Мои новости",
    response_model=PaginatedNews
    )
async def get_articles(
    recruiter_id: RecruiterId,
    page: int = 0,
    limit: int = 10
    ):
    return {
        "total_pages": math.ceil(News.count_documents({"recruiter_id": recruiter_id}) / limit),
        "page": page,
        "items": list(News.find({"recruiter_id": recruiter_id}, sort={"publication_date": -1}).skip(page * limit).limit(limit))
    }


@router.post(
    "/",
    name="Создать новость",
    response_model=NewsItemGet,
    )
async def post_article(
    recruiter_id: RecruiterId,
    payload: NewsItemPost
    ):
    dump = {
        **payload.model_dump(),
        "recruiter_id": recruiter_id
    }
    result = News.insert_one(dump)
    return {
        "_id": result.inserted_id,
        **dump
    }


@router.put(
    "/{article_id}",
    name="Отредактировать новость",
    response_model=NewsItemGet,
    )
async def post_article(
    recruiter_id: RecruiterId,
    article_id: OID,
    payload: NewsItemPost
    ):
    dump = payload.model_dump()
    result = News.find_one_and_update({"_id": article_id, "recruiter_id": recruiter_id}, {"$set": dump}, return_document=True)
    if not result:
        raise ARTICLE_NOT_BELONGS_TO_RECRUITER
    return result


@router.delete(
    "/{article_id}",
    name="Удалить новость",
    )
async def delete_artile(
    recruiter_id: RecruiterId,
    article_id: OID,
    ):
    result = News.delete_one({"recruiter_id": recruiter_id, "_id": article_id})
    if not result.deleted_count:
        raise ARTICLE_NOT_BELONGS_TO_RECRUITER
