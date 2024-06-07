import logging
from app.settings import Settings
import pymongo

mongo_client = pymongo.MongoClient(
    host=Settings.MONGO_HOST,
    username=Settings.MONGO_USERNAME,
    password=Settings.MONGO_PASSWORD
    )
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Vacancies = mongo_db.get_collection("vacancies")

logging.info("Подключение к MongoDB установлено")
