from app.aggregations import get_match_field_stage


SEARCH_BY_CANDIDATE_CV = lambda candidate: [
    get_match_field_stage(
        "$skills",
        "$work_experience", 
        "$work_type", 
        "$work_schedule",
        candidate.get("skills", []),
        candidate.get("work_experience", ""),
        candidate.get("work_type", ""),
        candidate.get("work_schedule", ""),
    ),
    {
        "$sort": {"match": -1}
    },
    {
        "$limit": 3,
    }
]
