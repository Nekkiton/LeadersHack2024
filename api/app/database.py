from pymongo import MongoClient

from app.aggregations import DETAILED_RESPONSES, DETAILED_VACANCIES
from app.settings import Settings


mongo_client = MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]
mongo_db.command({
    "create": "responses.detailed",
    "viewOn": "responses",
    "pipeline": DETAILED_RESPONSES
})
mongo_db.command({
    "create": "vacancies.detailed",
    "viewOn": "vacancies",
    "pipeline": DETAILED_VACANCIES
})


Users = mongo_db.get_collection("users")
Vacancies = mongo_db.get_collection("vacancies")
Stages = mongo_db.get_collection("stages")
Responses = mongo_db.get_collection("responses")
UsersCommentaries = mongo_db.get_collection("users.commentaries")
Tasks = mongo_db.get_collection("tasks")
Notifications = mongo_db.get_collection("notifications")
DetailedVacancies = mongo_db.get_collection("vacancies.detailed")
DetailedResponses = mongo_db.get_collection("responses.detailed")
News = mongo_db.get_collection("news")

Users.create_index(["email"], unique=True)