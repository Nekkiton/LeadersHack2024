from app.aggregations import get_match_field_stage


SEARCH_BY_CANDIDATE = lambda query, candidate, page, limit: [
    {
        "$match": query,
    },
    get_match_field_stage(
        "$skills",
        "$work_experience", 
        "$work_type", 
        "$work_schedule",
        candidate["skills"],
        candidate["work_type"],
        candidate["work_experience"],
        candidate["work_schedule"],
    ),
    {
        "$match": {"match": {"$gt": 50}}
    },
    {
        "$sort": {"match": -1}
    },
    {
        "$facet": {
            "total_pages": [{"$count": "count"}],
            "items": [{"$skip": page * limit}, {"$limit": limit}]
        }
    },
    {
        "$unwind": "$total_pages"
    },
    {
        "$project": {
            "page": {"$toInt": page},
            "total_pages": {
                "$trunc": 
                [{
                    "$divide": [
                        "$total_pages.count",
                        limit
                    ]
                }]
            },
            "items": "$items",
        }
    }
]