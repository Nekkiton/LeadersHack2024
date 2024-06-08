FROM python:3.12.3

WORKDIR /code

COPY . /code

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

EXPOSE 8080

CMD ["fastapi", "run", "main.py", "--port", "8080"]
#CMD hypercorn --bind 0.0.0.0:8080 main:app