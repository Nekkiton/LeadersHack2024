DAYS_WITH_INTERVIEWS = lambda recruiter_id, start_date, end_date, tz: [
    {
        "$match": {
            "body.recruiter_id": recruiter_id,
            "meet_at": {"$gte": start_date},
            "meet_at": {"$lte": end_date},
        }
    },
    {
        "$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$meet_at", "timezone": tz}},
            "interviews": {"$sum": 1},
            "slots": {"$push": "$meet_at"}
        }
    }
]