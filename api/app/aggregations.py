DETAILED_VACANCIES = [            
    {
        "$lookup": {
            "from": "stages",
            "localField": "_id",
            "foreignField": "vacancy_id",
            "pipeline": [
                {
                    "$sort": {
                        "position": 1
                    }
                }
            ],
            "as": "stages"
        }
    },
    {
        "$lookup": {
            "from": "responses",
            "localField": "_id",
            "foreignField": "vacancy_id",
            "as": "responses"
        }
    },
    {
        "$set": {
            "responses": {"$size": "$responses"}
        }
    }
]