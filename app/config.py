from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional

class Settings(BaseSettings):
	secret_key: str = Field(..., alias="SECRET_KEY")
	jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")
	access_token_expire_minutes: int = Field(60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
	database_url: str = Field("sqlite:///./data/app.db", alias="DATABASE_URL")
	redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
	ssh_timeout_seconds: int = Field(10, alias="SSH_TIMEOUT_SECONDS")
	poll_interval_seconds: int = Field(120, alias="POLL_INTERVAL_SECONDS")
	allow_origins: List[str] = Field(["*"], alias="ALLOW_ORIGINS")
	
	# Email alerts
	smtp_host: Optional[str] = Field(None, alias="SMTP_HOST")
	smtp_port: int = Field(587, alias="SMTP_PORT")
	smtp_username: Optional[str] = Field(None, alias="SMTP_USERNAME")
	smtp_password: Optional[str] = Field(None, alias="SMTP_PASSWORD")
	smtp_from: Optional[str] = Field(None, alias="SMTP_FROM")
	smtp_to: Optional[str] = Field(None, alias="SMTP_TO")
	
	# SMS alerts
	twilio_sid: Optional[str] = Field(None, alias="TWILIO_SID")
	twilio_token: Optional[str] = Field(None, alias="TWILIO_TOKEN")
	twilio_from: Optional[str] = Field(None, alias="TWILIO_FROM")
	twilio_to: Optional[str] = Field(None, alias="TWILIO_TO")

	class Config:
		env_file = ".env"
		env_file_encoding = "utf-8"
		populate_by_name = True

settings = Settings()
