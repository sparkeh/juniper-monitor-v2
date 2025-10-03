from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
import bcrypt
from .config import settings


def hash_password(password: str) -> str:
	# bcrypt has a 72-byte limit, so truncate if necessary
	if not isinstance(password, str):
		password = str(password)
	# Truncate to 72 characters to stay well under the 72-byte limit
	if len(password) > 72:
		password = password[:72]
	
	# Encode password to bytes and hash
	password_bytes = password.encode('utf-8')
	salt = bcrypt.gensalt(rounds=12)
	hashed = bcrypt.hashpw(password_bytes, salt)
	return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
	# bcrypt has a 72-byte limit, so truncate if necessary
	if not isinstance(plain_password, str):
		plain_password = str(plain_password)
	# Truncate to 72 characters to stay well under the 72-byte limit
	if len(plain_password) > 72:
		plain_password = plain_password[:72]
	
	# Encode password to bytes and verify
	password_bytes = plain_password.encode('utf-8')
	hashed_bytes = hashed_password.encode('utf-8')
	return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
	expires_delta = timedelta(minutes=expires_minutes or settings.access_token_expire_minutes)
	expire = datetime.now(timezone.utc) + expires_delta
	payload = {"sub": subject, "exp": expire}
	return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
	return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
