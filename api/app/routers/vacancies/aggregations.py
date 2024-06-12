SEARCH_BY_CANDIDATE = lambda query, candidate, page, limit: [
    {
        "$match": query,
    },
    {
        "$addFields": {
            "match": {
                "$function": {
                    "body": """
                    function(
                        skills, 
                        work_experience, 
                        work_type, 
                        work_schedule,
                        candidateSkills,
                        candidateWorkType,
                        candidateWorkExperience,
                        candidateWorkSchedule,
                        ) {
                        total = skills.length + 3;
                        matched = 0;
                        for (let [key, value] of Object.entries(skills)) {
                            if (candidateSkills.includes(value)) {
                                matched += 1;
                            }
                        }
                        if (candidateWorkType == work_type) {
                            matched += 1;
                        } 
                        if (candidateWorkExperience == work_experience) {
                            matched += 1;
                        }
                        if (candidateWorkSchedule == work_schedule) {
                            matched += 1;
                        }
                        return Math.round((matched / total) * 100)
                    }
                    """,
                    "args": [
                        "$skills",
                        "$work_experience",
                        "$work_type",
                        "$work_schedule",
                        candidate["skills"],
                        candidate["work_type"],
                        candidate["work_experience"],
                        candidate["work_schedule"]
                    ],
                    "lang": "js",
                }
            }
        }
    },
    #{
    #    "$match": {"match": {"$gt": 50}}
    #},
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