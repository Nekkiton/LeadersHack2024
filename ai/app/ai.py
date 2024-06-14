import os
import json
from openai import OpenAI
from app.prompts import CV_PARSE_PROMPT, CV_EXAMPLE_JSON, VACANCY_PROMPT, VACANCY_EXAMPLE_JSON
from app.schemas.candidates import CandidatePartial
from app.schemas.vacancies import VacancyPartial
from typing import IO, get_args
from fastapi import UploadFile
from app.literals import Educations, WorkSchedules, WorkExperiences, WorkTypes, WorkScopes, Skills

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

cv_assistant = client.beta.assistants.create(
  name="CV Parse Assistant",
  instructions="You are assistant of it recruiter. You have to get information from file with candidates CVs and parse it correctly.",
  model="gpt-4o",
  tools=[{"type": "file_search"}],
)

vacancy_assistant = client.beta.assistants.create(
  name="CV Parse Assistant",
  instructions="You are assistant of it recruiter. You have to parse information about vacancy from provided JSON string and interpreter it to add additional information.",
  model="gpt-4o",
)

def parse_cv(file: UploadFile) -> str:
    message_file = client.files.create(file=(file.filename, file.file), purpose="assistants")

    thread = client.beta.threads.create(
    messages=[
        {
        "role": "assistant",
        "content": "Provide output in valid JSON format. The data schema should be like this: "+json.dumps(CV_EXAMPLE_JSON)
        },
        {
        "role": "user",
        "content": CV_PARSE_PROMPT % {
            "work_experiences": ', '.join(get_args(WorkExperiences)),
            "degrees": ', '.join(get_args(Educations))
        },
        "attachments": [
            { "file_id": message_file.id, "tools": [{"type": "file_search"}] }
        ],
        }
    ]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id, assistant_id=cv_assistant.id
    )

    cv = ''

    if run.status == 'completed': 
        messages = list(client.beta.threads.messages.list(
            thread_id=thread.id, run_id=run.id
        ))
        cv = messages[0].content[0].text.value

    client.beta.threads.delete(thread_id=thread.id)
    return cv.replace('''\n''','').strip('`').lstrip('json')


def process_vacancy(vacancy: VacancyPartial) -> str:
    thread = client.beta.threads.create(
    messages=[
        {
        "role": "assistant",
        "content": "Provide output in valid JSON format. The data schema should be like this: "+json.dumps(VACANCY_EXAMPLE_JSON)
        },
        {
        "role": "user",
        "content": VACANCY_PROMPT % {
            "json": vacancy,
            "scopes": ', '.join(get_args(WorkScopes)),
            "work_types": ', '.join(get_args(WorkTypes)),
            "work_schedules": ', '.join(get_args(WorkSchedules)),
            "work_experiences": ', '.join(get_args(WorkExperiences)),
            "skills": ', '.join(get_args(Skills)),
        },
        }
    ]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id, assistant_id=cv_assistant.id
    )

    vacancy = ''

    if run.status == 'completed': 
        messages = list(client.beta.threads.messages.list(
            thread_id=thread.id, run_id=run.id
        ))
        vacancy = messages[0].content[0].text.value

    client.beta.threads.delete(thread_id=thread.id)
    return vacancy.replace('''\n''','').strip('`').lstrip('json')