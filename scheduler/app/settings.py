from envclass import EnvClass


class Settings(EnvClass):
    MONGO_HOST: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_DATABASE: str
