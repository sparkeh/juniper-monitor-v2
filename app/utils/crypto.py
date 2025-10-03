from cryptography.fernet import Fernet, InvalidToken
from hashlib import sha256
from ..config import settings

# Derive a 32-byte key from SECRET_KEY
_key = sha256(settings.secret_key.encode("utf-8")).digest()
fernet = Fernet(Fernet.generate_key())
# Reinitialize fernet with deterministic key length using first 32 bytes base64
import base64
fernet = Fernet(base64.urlsafe_b64encode(_key))


def encrypt_secret(plaintext: str) -> str:
	if plaintext is None:
		return ""
	return fernet.encrypt(plaintext.encode("utf-8")).decode("utf-8")


def decrypt_secret(ciphertext: str) -> str:
	if not ciphertext:
		return ""
	try:
		return fernet.decrypt(ciphertext.encode("utf-8")).decode("utf-8")
	except InvalidToken:
		return ""
