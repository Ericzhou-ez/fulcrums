from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    mongodb_uri: str
    firebase_project_id: str
    firebase_storage_bucket: str
    firebase_service_account_path: str | None = None
    cors_origins: str = "http://localhost:5173,https://fulcrums.ca"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
