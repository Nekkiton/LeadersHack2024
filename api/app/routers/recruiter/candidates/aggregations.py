from app.aggregations import get_match_field_stage

USERS_MATCH_BY_VACANCY = lambda vacancy, page, limit: [
    get_match_field_stage(
        vacancy["skills"],
        vacancy["work_experience"],
        vacancy["work_type"],
        vacancy["work_schedule"],
        "$skills",
        "$work_experience", 
        "$work_type", 
        "$work_schedule",
    ),
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

USERS_BY_FIO = lambda query, page, limit: [
    {
        "$project": {
            "fio": {
                "$concat": [
                    "$name",
                    " ",
                    "$patronymic",
                    " ",
                    "$surname",
                ]
            }
        }
    },
    {
        "$match": query
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