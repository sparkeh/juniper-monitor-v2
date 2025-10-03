from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from .config import settings
from .db import Base, engine
from .poller import start_scheduler, stop_scheduler
from .routers import auth, devices, checks, alerts, ws

app = FastAPI(title="Juniper Monitor", default_response_class=ORJSONResponse)

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.allow_origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(devices.router, prefix="/api/devices", tags=["devices"])
app.include_router(checks.router, prefix="/api/checks", tags=["checks"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(ws.router, tags=["ws"])

@app.on_event("startup")
def on_startup() -> None:
	Base.metadata.create_all(bind=engine)
	start_scheduler()

@app.on_event("shutdown")
def on_shutdown() -> None:
	stop_scheduler()

@app.get("/health")
def health() -> dict:
	return {"status": "ok"}
