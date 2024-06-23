from envclass import EnvClass


class Settings(EnvClass):
    MONGO_CONNECTION_STRING: str
    MONGO_DATABASE: str

    EMAIL_HOST: str = "smtp.yandex.ru"
    EMAIL_PORT: int = 465
    EMAIL_USER: str
    EMAIL_PASS: str

    TELEMOST_API: str
    AI_URL: str
    ZOOM_CLIENT_ID: str
    ZOOM_ACCOUNT_ID: str
    ZOOM_CLIENT_SECRET: str
    MEET_CREDENTIALS_PATH: str = "/creds/"