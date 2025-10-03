from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from .config import settings
from .db import SessionLocal
from .models import Device, CheckResult, Alert
from .utils.ping import ping_host
from .utils.ssh import SSHClient
from .utils.crypto import decrypt_secret
from . import parsers
from .alerting import alert_manager

scheduler = BackgroundScheduler()

COMMANDS = [
	("bgp", "show bgp summary", parsers.parse_bgp_summary),
	("isis", "show isis adjacency detail", parsers.parse_isis_adjacency),
	("ldp", "show ldp neighbor", parsers.parse_ldp_neighbor),
	("interfaces", "show interfaces terse", parsers.parse_interfaces_terse),
	("alarms", "show system alarms", parsers.parse_system_alarms),
	("hardware", "show chassis hardware", parsers.parse_chassis_hardware),
	("environment", "show chassis environment", parsers.parse_chassis_environment),
	("uptime", "show system uptime", parsers.parse_system_uptime),
	("route", "show route summary", parsers.parse_route_summary),
	("pppoe", "show pppoe interfaces", parsers.parse_pppoe_interfaces),
]


def poll_all_devices() -> None:
	db: Session = SessionLocal()
	try:
		devices: List[Device] = db.query(Device).all()
		for d in devices:
			poll_device(db, d)
	finally:
		db.close()


def poll_device(db: Session, device: Device) -> None:
	# ICMP first
	online, latency = ping_host(device.ip_address, timeout_seconds=2)
	if online:
		device.last_online = datetime.utcnow()
	db.add(device)
	db.commit()

	if not online:
		result = CheckResult(device_id=device.id, category="connectivity", status="error", message="Host unreachable via ICMP", raw_output="")
		db.add(result)
		db.commit()
		return

	password = decrypt_secret(device.ssh_password_enc or "")
	ssh = SSHClient(
		hostname=device.ip_address,
		port=device.ssh_port or 22,
		username=device.ssh_username,
		password=password or None,
		key_filename=device.ssh_private_key_path or None,
		timeout=settings.ssh_timeout_seconds,
	)
	for category, cmd, parser in COMMANDS:
		try:
			code, out, err = ssh.run_command(cmd)
			raw = out if out else err
			status, message, details = parser(raw)
			if code != 0 and status == "ok":
				status = "warn"
			
			# Store details as JSON in the raw_output field for now
			import json
			details_json = json.dumps(details) if details else ""
			result = CheckResult(device_id=device.id, category=category, status=status, message=message, raw_output=details_json)
			db.add(result)
			
			# Create alert for critical issues
			if status in ["error", "warn"] and category in ["bgp", "isis", "ldp", "alarms", "environment"]:
				alert = Alert(
					device_id=device.id,
					severity="critical" if status == "error" else "warning",
					message=f"{category.upper()}: {message}"
				)
				db.add(alert)
				db.commit()
				# Send notifications
				import asyncio
				asyncio.create_task(alert_manager.send_alert(device, alert))
		except Exception as ex:
			result = CheckResult(device_id=device.id, category=category, status="error", message=str(ex), raw_output="")
			db.add(result)
		db.commit()

	device.last_check = datetime.utcnow()
	db.add(device)
	db.commit()


def start_scheduler() -> None:
	if not scheduler.running:
		scheduler.add_job(poll_all_devices, "interval", seconds=settings.poll_interval_seconds, id="poll-all", replace_existing=True)
		scheduler.start()


def stop_scheduler() -> None:
	if scheduler.running:
		scheduler.shutdown()
