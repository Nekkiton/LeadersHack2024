from typing import List

from app.schemas import CandidateResponse, Pagination


class CandidatesGet(Pagination):
    items: List[CandidateResponse]


class CandidateMatch(CandidateResponse):
    match: int


class CandidatesMatchGet(Pagination):
    items: List[CandidateMatch]
