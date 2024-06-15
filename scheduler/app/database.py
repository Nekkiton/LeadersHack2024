import logging
from app.settings import Settings
import pymongo

mongo_client = pymongo.MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Vacancies = mongo_db.get_collection("vacancies")
Stages = mongo_db.get_collection("stages")
Users = mongo_db.get_collection("users")

logging.info("Подключение к MongoDB установлено")
