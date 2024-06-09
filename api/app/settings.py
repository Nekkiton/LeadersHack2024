from envclass import EnvClass


class Settings(EnvClass):
    MONGO_HOST: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_DATABASE: str
    MONGO_CONNECTION_STRING: str

    REFRESH_TOKEN_EXPIRES_IN: int = 90*24*60*60
    ACCESS_TOKEN_EXPIRES_IN: int = 15*60
    JWT_ALGORITHM: str
    JWT_PUBLIC_KEY_PATH: str = "api/public.key.pub"
    JWT_PRIVATE_KEY_PATH: str = "api/private.key"

    ALLOWED_ORIGINS: str

