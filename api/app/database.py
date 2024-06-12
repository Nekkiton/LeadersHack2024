from pymongo import MongoClient

from app.aggregations import DETAILED_VACANCIES
from app.settings import Settings


mongo_client = MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Users = mongo_db.get_collection("users")
Vacancies = mongo_db.get_collection("vacancies")
Stages = mongo_db.get_collection("stages")
Responses = mongo_db.get_collection("responses")
UsersCommentaries = mongo_db.get_collection("users.commentaries")

# Временно, пока параметры View могут меняться, при каждом запуске бэкенда он будет дропаться и пересоздаваться
mongo_db.drop_collection("vacancies.detailed")

mongo_db.command({
    "create": "vacancies.detailed",
    "viewOn": "vacancies",
    "pipeline": DETAILED_VACANCIES
})
DetailedVacancies = mongo_db.get_collection("vacancies.detailed")

Users.create_index(["email"], unique=True)