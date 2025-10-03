from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"

class UserCreate(BaseModel):
	email: EmailStr
	password: str
	role: str = "viewer"

class UserOut(BaseModel):
	id: int
	email: EmailStr
	role: str
	is_active: bool
	created_at: datetime

	class Config:
		from_attributes = True

class DeviceBase(BaseModel):
	hostname: str
	ip_address: str
	ssh_port: int = 22
	ssh_username: Optional[str] = None
	ssh_password: Optional[str] = None
	ssh_private_key_path: Optional[str] = None

class DeviceCreate(DeviceBase):
	pass

class DeviceOut(DeviceBase):
	id: int
	model: Optional[str] = None
	serial_number: Optional[str] = None
	last_online: Optional[datetime] = None
	last_check: Optional[datetime] = None

	class Config:
		from_attributes = True

class CheckResultOut(BaseModel):
	id: int
	category: str
	status: str
	message: Optional[str]
	created_at: datetime

	class Config:
		from_attributes = True

class AlertOut(BaseModel):
	id: int
	severity: str
	message: str
	acknowledged: bool
	created_at: datetime

	class Config:
		from_attributes = True

class LoginIn(BaseModel):
	email: EmailStr
	password: str

class PingResult(BaseModel):
	online: bool
	latency_ms: Optional[float] = None
