import os
import json
from openai import OpenAI
from app.prompts import CV_PARSE_PROMPT, CV_EXAMPLE_JSON
from app.schemas.candidates import CandidatePartial
from typing import IO
from fastapi import UploadFile

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

cv_assistant = client.beta.assistants.create(
  name="CV Parse Assistant",
  instructions="You are assistant of it recrutier. You have to get information from file with candidates CVs and parse it correctly.",
  model="gpt-4o",
  tools=[{"type": "file_search"}],
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
        "content": CV_PARSE_PROMPT,
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