from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
	# bcrypt has a 72-byte limit, so truncate if necessary
	password_bytes = password.encode('utf-8')
	if len(password_bytes) > 72:
		password = password[:72]
	return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
	# bcrypt has a 72-byte limit, so truncate if necessary
	password_bytes = plain_password.encode('utf-8')
	if len(password_bytes) > 72:
		plain_password = plain_password[:72]
	return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
	expires_delta = timedelta(minutes=expires_minutes or settings.access_token_expire_minutes)
	expire = datetime.now(timezone.utc) + expires_delta
	payload = {"sub": subject, "exp": expire}
	return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
	return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
