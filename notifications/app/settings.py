from envclass import EnvClass


class Settings(EnvClass):
    MONGO_CONNECTION_STRING: str
    MONGO_DATABASE: str

    EMAIL_HOST: str = "smtp.yandex.ru"
    EMAIL_PORT: str = "465"
    EMAIL_USER: str
    EMAIL_PASS: str

    TELEMOST_API: str
    AI_URL: str