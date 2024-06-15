DAYS_WITH_MAX_INTERVIEWS = lambda recruiter_id, start_date, end_date: [
    {
        "$match": {
            "body.recruiter_id": recruiter_id,
            "meet_at": {"$gte": start_date},
            "meet_at": {"$lte": end_date},
        }
    },
    {
        "$group": {
            "_id": {"$dayOfYear": "$meet_at"},
            "interviews": {"$sum": 1},
            "slots": {"$push": "$meet_at"}
        }
    }
]