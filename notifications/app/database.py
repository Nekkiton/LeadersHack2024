from pymongo import MongoClient

from app.settings import Settings

mongo_db = MongoClient(Settings.MONGO_CONNECTION_STRING).get_database(Settings.MONGO_DATABASE)

Tasks = mongo_db.get_collection("tasks")
Notifications = mongo_db.get_collection("notifications")
Users = mongo_db.get_collection("users")
DetailedResponses = mongo_db.get_collection("responses.detailed")
Vacancies = mongo_db.get_collection("vacancies")
Stages = mongo_db.get_collection("stages")