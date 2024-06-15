from envclass import EnvClass


class Settings(EnvClass):
    MONGO_CONNECTION_STRING: str
    MONGO_DATABASE: str

    EMAIL_FROM: str
    EMAIL_HOST: str
    EMAIL_PORT: str
    EMAIL_USER: str
    EMAIL_PASS: str

    TELEMOST_API: str