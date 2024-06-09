from pymongo import MongoClient
from app.settings import Settings


mongo_client = MongoClient(Settings.MONGO_CONNECTION_STRING)
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Users = mongo_db.get_collection("users")
Vacancies = mongo_db.get_collection("vacancies")

Users.create_index(["email"], unique=True)