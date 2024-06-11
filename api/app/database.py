from pymongo import MongoClient

from app.aggregations import DETAILED_VACANCIES
from app.settings import Settings


mongo_client = MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Users = mongo_db.get_collection("users")
Vacancies = mongo_db.get_collection("vacancies")
Stages = mongo_db.get_collection("stages")


# Временно, пока параметры View могут меняться, при каждом запуске бэкенда он будет дропаться и пересоздаваться
mongo_db.drop_collection("detailed_vacancies")

mongo_db.command({
    "create": "detailed_vacancies",
    "viewOn": "vacancies",
    "pipeline": DETAILED_VACANCIES
})
DetailedVacancies = mongo_db.get_collection("detailed_vacancies")

Users.create_index(["email"], unique=True)