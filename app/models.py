from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	email = Column(String(255), unique=True, index=True, nullable=False)
	password_hash = Column(String(255), nullable=False)
	role = Column(String(32), default="viewer")  # viewer, admin
	is_active = Column(Boolean, default=True)
	created_at = Column(DateTime, default=datetime.utcnow)

class Device(Base):
	__tablename__ = "devices"
	id = Column(Integer, primary_key=True, index=True)
	hostname = Column(String(255), unique=True, index=True, nullable=False)
	ip_address = Column(String(64), index=True, nullable=False)
	ssh_port = Column(Integer, default=22)
	ssh_username = Column(String(128), nullable=True)
	ssh_password_enc = Column(Text, nullable=True)
	ssh_private_key_path = Column(String(512), nullable=True)
	model = Column(String(128), nullable=True)
	serial_number = Column(String(128), nullable=True)
	last_online = Column(DateTime, nullable=True)
	last_check = Column(DateTime, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	checks = relationship("CheckResult", back_populates="device", cascade="all, delete-orphan")
	alerts = relationship("Alert", back_populates="device", cascade="all, delete-orphan")

class CheckResult(Base):
	__tablename__ = "check_results"
	id = Column(Integer, primary_key=True, index=True)
	device_id = Column(Integer, ForeignKey("devices.id"), index=True)
	category = Column(String(64), index=True)  # bgp, isis, ldp, interfaces, alarms, hardware, environment, uptime, route, pppoe
	status = Column(String(32), index=True)  # ok, warn, error, unknown
	message = Column(Text, nullable=True)
	raw_output = Column(Text, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, index=True)
	device = relationship("Device", back_populates="checks")

class Alert(Base):
	__tablename__ = "alerts"
	id = Column(Integer, primary_key=True, index=True)
	device_id = Column(Integer, ForeignKey("devices.id"), index=True)
	severity = Column(String(32), index=True)  # info, warning, critical
	message = Column(Text, nullable=False)
	acknowledged = Column(Boolean, default=False)
	created_at = Column(DateTime, default=datetime.utcnow)
	device = relationship("Device", back_populates="alerts")
