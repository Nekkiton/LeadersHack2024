from envclass import EnvClass


class Settings(EnvClass):
    MONGO_DATABASE: str
    MONGO_CONNECTION_STRING: str

    REFRESH_TOKEN_EXPIRES_IN: int = 90*24*60*60
    ACCESS_TOKEN_EXPIRES_IN: int = 24*60*60
    JWT_ALGORITHM: str = "RS256"
    JWT_PUBLIC_KEY_PATH: str = "/code/public.key.pub"
    JWT_PRIVATE_KEY_PATH: str = "/code/private.key"

    ALLOWED_ORIGINS: str

    TELEMOST_API: str