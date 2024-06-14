PAGINATED_MATCH_RESPONSES = lambda vacancy_id, page, limit: [
    [
        {
            "$match": {
                "vacancy_id": vacancy_id
            }
        },
        {
            "$facet": {
                "0": [{"$count": "c"}],
                "5": [{"$match": {"match": {"$gte": 50}}}, {"$count": "c"}],
                "7": [{"$match": {"match": {"$gte": 75}}}, {"$count": "c"}],
                "9": [{"$match": {"match": {"$gte": 90}}}, {"$count": "c"}],
                "items": [{"$skip": page * limit}, {"$limit": limit}]
            }
        },
        {
            "$project": {
                "match": {
                    "gte0": {"$first": "$0.c"},
                    "gte50": {"$first": "$5.c"},
                    "gte70": {"$first": "$7.c"},
                    "90": {"$first": "$9.c"},
                },
                "total_pages": {
                    "$trunc": [{
                        "$divide": [
                            {"$first": "$0.c"},
                            limit
                        ]
                    }]
                },
                "page": {"$toInt": page},
                "items": 1,
            }
        }
    ]
]