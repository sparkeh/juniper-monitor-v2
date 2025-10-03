import asyncio
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client
from sqlalchemy.orm import Session
from typing import Optional
from .config import settings
from .models import Device, Alert

class AlertManager:
    def __init__(self):
        self.smtp_host = getattr(settings, 'smtp_host', None)
        self.smtp_port = getattr(settings, 'smtp_port', 587)
        self.smtp_username = getattr(settings, 'smtp_username', None)
        self.smtp_password = getattr(settings, 'smtp_password', None)
        self.smtp_from = getattr(settings, 'smtp_from', None)
        self.smtp_to = getattr(settings, 'smtp_to', None)
        
        self.twilio_sid = getattr(settings, 'twilio_sid', None)
        self.twilio_token = getattr(settings, 'twilio_token', None)
        self.twilio_from = getattr(settings, 'twilio_from', None)
        self.twilio_to = getattr(settings, 'twilio_to', None)
        
        self.twilio_client = None
        if self.twilio_sid and self.twilio_token:
            self.twilio_client = Client(self.twilio_sid, self.twilio_token)

    async def send_email_alert(self, device: Device, alert: Alert) -> bool:
        if not all([self.smtp_host, self.smtp_username, self.smtp_password, self.smtp_from, self.smtp_to]):
            return False
            
        try:
            message = MIMEMultipart()
            message["From"] = self.smtp_from
            message["To"] = self.smtp_to
            message["Subject"] = f"Juniper Monitor Alert: {device.hostname}"
            
            body = f"""
Device: {device.hostname} ({device.ip_address})
Severity: {alert.severity.upper()}
Message: {alert.message}
Time: {alert.created_at}
            """
            message.attach(MIMEText(body, "plain"))
            
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                use_tls=True
            )
            return True
        except Exception as e:
            print(f"Failed to send email alert: {e}")
            return False

    def send_sms_alert(self, device: Device, alert: Alert) -> bool:
        if not self.twilio_client or not self.twilio_from or not self.twilio_to:
            return False
            
        try:
            message = f"Juniper Alert: {device.hostname} - {alert.severity.upper()}: {alert.message}"
            self.twilio_client.messages.create(
                body=message,
                from_=self.twilio_from,
                to=self.twilio_to
            )
            return True
        except Exception as e:
            print(f"Failed to send SMS alert: {e}")
            return False

    async def send_alert(self, device: Device, alert: Alert) -> None:
        if alert.severity in ['critical', 'error']:
            await self.send_email_alert(device, alert)
            self.send_sms_alert(device, alert)

alert_manager = AlertManager()
