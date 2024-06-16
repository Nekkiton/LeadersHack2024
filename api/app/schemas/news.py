from typing import List, Optional
from pydantic import Base64Str, BaseModel
from datetime import datetime

from . import OID, BaseGet, Pagination


class NewsItemPost(BaseModel):
    title: str
    text: str
    image: Base64Str
    publication_date: datetime


class NewsItemGet(NewsItemPost, BaseGet):
    recruiter_id: Optional[OID] = None


class PaginatedNews(Pagination):
    items: List[NewsItemGet]