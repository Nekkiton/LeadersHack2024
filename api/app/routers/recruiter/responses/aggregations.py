PAGINATED_MATCH_RESPONSES = lambda query, page, limit: [
    {
        "$match": query
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
                "all": {"$first": "$0.c"},
                "gte50": {"$first": "$5.c"},
                "gte70": {"$first": "$7.c"},
                "gte90": {"$first": "$9.c"}
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