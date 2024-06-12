FROM python:3.12.3

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/

EXPOSE 8000

CMD ["fastapi", "run", "main.py", "--port", "8000"]
#CMD hypercorn --bind 0.0.0.0:8000 main:app