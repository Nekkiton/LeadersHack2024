import logging
from app.settings import Settings
import pymongo

mongo_client = pymongo.MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Vacancies = mongo_db.get_collection("vacancies")

logging.info("Подключение к MongoDB установлено")
