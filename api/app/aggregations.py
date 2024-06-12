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

DETAILED_RESPONSES = [
    {
        "$lookup": {
            "from": "vacancies.detailed",
            "localField": "vacancy_id",
            "foreignField": "_id",
            "as": "vacancy"
        }
    },
    {
        "$unwind": "$vacancy"
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "candidate_id",
            "foreignField": "_id",
            "as": "candidate"
        }
    },
    {
        "$unwind": "$candidate"
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
                        "$vacancy.skills",
                        "$vacancy.work_experience",
                        "$vacancy.work_type",
                        "$vacancy.work_schedule",
                        "$candidate.skills",
                        "$candidate.work_type",
                        "$candidate.work_experience",
                        "$candidate.work_schedule"
                    ],
                    "lang": "js",
                }
            }
        }
    },
]

def get_match_field_stage(
    vacancy_skills,
    vacancy_experience,
    vacancy_type,
    vacancy_schedule,
    candidate_skills,
    candidate_experience,
    candidate_type,
    candidate_schedule
) -> dict:
    return {
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
                        vacancy_skills,
                        vacancy_experience,
                        vacancy_type,
                        vacancy_schedule,
                        candidate_skills,
                        candidate_type,
                        candidate_experience,
                        candidate_schedule
                    ],
                    "lang": "js",
                }
            }
        }
    }