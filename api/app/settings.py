from envclass import EnvClass


class Settings(EnvClass):
    MONGO_HOST: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_DATABASE: str

    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str
    REFRESH_TOKEN_EXPIRES_IN: int = 90*24*60*60
    ACCESS_TOKEN_EXPIRES_IN: int = 15*60
    JWT_ALGORITHM: str

    ALLOWED_ORIGINS: str

