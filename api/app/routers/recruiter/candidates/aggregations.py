from app.aggregations import get_match_field_stage

USERS_MATCH_BY_VACANCY = lambda vacancy, page, limit: [
    {
        "$match": {
            "role": "candidate"
        }
    },
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
            "0": [{"$count": "c"}],
            "3": [{"$match": {"match": {"$gte": 30}}}, {"$count": "c"}],
            "5": [{"$match": {"match": {"$gte": 50}}}, {"$count": "c"}],
            "7": [{"$match": {"match": {"$gte": 75}}}, {"$count": "c"}],
            "9": [{"$match": {"match": {"$gte": 90}}}, {"$count": "c"}],
            "items": []
        }
    },
    {
        "$facet": {
            "0": [{"$count": "c"}],
            "5": [{"$match": {"match": {"$gte": 50}}}, {"$count": "c"}],
            "7": [{"$match": {"match": {"$gte": 75}}}, {"$count": "c"}],
            "9": [{"$match": {"match": {"$gte": 90}}}, {"$count": "c"}],
            "items": []
        }
    },
    {
        "$project": {
            "match": {
                "all": {"$first": "$0.c"},
                "gte50": {"$first": "$5.c"},
                "gte70": {"$first": "$7.c"},
                "gte90": {"$first": "$9.c"},
            },
            "total_pages": {
                "$ceil": [{
                    "$divide": [
                        {"$first": "$0.c"},
                        2
                    ]
                }]
            },
            "items": 1,
        }
    }
]

USERS_BY_FIO = lambda query, page, limit: [
    {
        "$addFields": {
            "fio": {
                "$concat": [
                    "$surname",
                    " ",
                    "$name",
                    {
                        "$cond": [
                            {"$eq": ["$patronymic", None]},
                            "",
                          	{"$concat": [" ", "$patronymic"]}
                        ]
                    },
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
                "$ceil": 
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
