from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Alert, Device
from ..schemas import AlertOut
from ..routers.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db), user=Depends(get_current_user)):
	return db.query(Alert).order_by(Alert.created_at.desc()).limit(200).all()


@router.post("/{alert_id}/ack")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
	alert = db.query(Alert).get(alert_id)
	if not alert:
		raise HTTPException(status_code=404, detail="Not found")
	alert.acknowledged = True
	db.add(alert)
	db.commit()
	return {"ok": True}
