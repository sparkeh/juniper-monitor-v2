from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Device, CheckResult
from ..schemas import CheckResultOut
from ..routers.auth import get_current_user
from ..poller import poll_device

router = APIRouter()


@router.get("/{device_id}", response_model=List[CheckResultOut])
def recent_checks(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
	dev = db.query(Device).get(device_id)
	if not dev:
		raise HTTPException(status_code=404, detail="Not found")
	rows = (
		db.query(CheckResult)
		.filter(CheckResult.device_id == device_id)
		.order_by(CheckResult.created_at.desc())
		.limit(100)
		.all()
	)
	return rows


@router.post("/{device_id}/poll")
def trigger_poll(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
	dev = db.query(Device).get(device_id)
	if not dev:
		raise HTTPException(status_code=404, detail="Not found")
	poll_device(db, dev)
	return {"ok": True}
