from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Device, User
from ..schemas import DeviceOut, DeviceCreate, PingResult
from ..routers.auth import get_current_user
from ..utils.crypto import encrypt_secret
from ..utils.ping import ping_host

router = APIRouter()


@router.get("/", response_model=List[DeviceOut])
def list_devices(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
	return db.query(Device).all()


@router.post("/", response_model=DeviceOut)
def create_device(body: DeviceCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
	if user.role != "admin":
		raise HTTPException(status_code=403, detail="Admin role required")
	existing = db.query(Device).filter(Device.hostname == body.hostname).first()
	if existing:
		raise HTTPException(status_code=400, detail="Hostname already exists")
	dev = Device(
		hostname=body.hostname,
		ip_address=body.ip_address,
		ssh_port=body.ssh_port or 22,
		ssh_username=body.ssh_username,
		ssh_password_enc=encrypt_secret(body.ssh_password) if body.ssh_password else None,
		ssh_private_key_path=body.ssh_private_key_path,
	)
	db.add(dev)
	db.commit()
	db.refresh(dev)
	return dev


@router.get("/{device_id}", response_model=DeviceOut)
def get_device(device_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
	dev = db.query(Device).get(device_id)
	if not dev:
		raise HTTPException(status_code=404, detail="Not found")
	return dev


@router.delete("/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
	if user.role != "admin":
		raise HTTPException(status_code=403, detail="Admin role required")
	dev = db.query(Device).get(device_id)
	if not dev:
		raise HTTPException(status_code=404, detail="Not found")
	db.delete(dev)
	db.commit()
	return {"ok": True}


@router.get("/{device_id}/ping", response_model=PingResult)
def ping_device(device_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
	dev = db.query(Device).get(device_id)
	if not dev:
		raise HTTPException(status_code=404, detail="Not found")
	success, latency = ping_host(dev.ip_address, timeout_seconds=2)
	return PingResult(online=success, latency_ms=latency)
