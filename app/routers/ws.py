from fastapi import APIRouter, WebSocket
import json

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
	await websocket.accept()
	await websocket.send_json({"type": "welcome", "message": "connected"})
	# Placeholder; in production, push on DB events or scheduler hooks
	try:
		while True:
			msg = await websocket.receive_text()
			await websocket.send_text(json.dumps({"echo": msg}))
	except Exception:
		pass
