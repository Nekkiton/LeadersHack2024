from envclass import EnvClass


class Settings(EnvClass):
    MONGO_DATABASE: str
    MONGO_CONNECTION_STRING: str

    AI_URL: str
