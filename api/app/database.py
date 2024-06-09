from pymongo import MongoClient
from app.settings import Settings


mongo_client = MongoClient(
    host=Settings.MONGO_HOST,
    username=Settings.MONGO_USERNAME,
    password=Settings.MONGO_PASSWORD
    )
mongo_db = mongo_client[Settings.MONGO_DATABASE]

Users = mongo_db.get_collection("users")
Vacancies = mongo_db.get_collection("vacancies")

Users.create_index(["email"], unique=True)