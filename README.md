## Juniper Monitor

A FastAPI + React application to monitor Juniper network devices (SRX/MX) via SSH with ICMP pre-checks, scheduled polling, and realtime updates.

### Backend Setup (Ubuntu Server)

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv build-essential
cd /opt
sudo mkdir -p /opt/juniper-monitor
sudo chown "$USER":"$USER" /opt/juniper-monitor
cd /opt/juniper-monitor
# copy project files here
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
# Edit .env to set SECRET_KEY and DB/redis settings
# Optional: configure SMTP/Twilio for alerts
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API will be at `http://SERVER:8000`. Create first admin user:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"change_me","role":"admin"}'
```

Login to get token:

```bash
curl -X POST http://localhost:8000/api/auth/login -d 'username=admin@example.com&password=change_me' -H 'Content-Type: application/x-www-form-urlencoded'
```

Add a device (admin token required):

```bash
curl -X POST http://localhost:8000/api/devices/ \
 -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' \
 -d '{"hostname":"mx204-1","ip_address":"192.0.2.10","ssh_port":22,"ssh_username":"netops","ssh_password":"YOURPASS"}'
```

### Systemd Service

Create service file `/etc/systemd/system/juniper-monitor.service`:

```ini
[Unit]
Description=Juniper Monitor API
After=network.target

[Service]
User=juniper
Group=juniper
WorkingDirectory=/opt/juniper-monitor
Environment="PATH=/opt/juniper-monitor/.venv/bin"
ExecStart=/opt/juniper-monitor/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Create user and enable:

```bash
sudo useradd -r -s /usr/sbin/nologin juniper || true
sudo chown -R juniper:juniper /opt/juniper-monitor
sudo systemctl daemon-reload
sudo systemctl enable --now juniper-monitor
sudo systemctl status juniper-monitor
```

Logs:

```bash
journalctl -u juniper-monitor -f
```

### Frontend Setup

The React frontend is included in this project. To run it:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000` and automatically proxies API calls to the backend.

For production, build the frontend:

```bash
npm run build
# Serve the dist/ directory with nginx or similar
```

### Features
- **Device Monitoring**: ICMP ping + SSH command execution on Juniper devices
- **Real-time Updates**: WebSocket integration for live status updates
- **Alerting**: Email (SMTP) and SMS (Twilio) notifications for critical issues
- **Security**: JWT authentication, encrypted credential storage, role-based access
- **Responsive UI**: React dashboard with device overview and detailed views
- **Historical Data**: SQLite storage for check results and alert history

### Configuration
- Credentials are encrypted at rest using a key derived from `SECRET_KEY`
- Polling is handled by APScheduler at `POLL_INTERVAL_SECONDS` (default: 120s)
- SSH uses Paramiko. Ensure network ACLs and keys/passwords are correct
- Data is stored in SQLite by default under `./data/app.db`
- No mock data is created; add devices via API

### Alerting Setup (Optional)
Configure email alerts by setting SMTP_* variables in `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=alerts@yourcompany.com
```

Configure SMS alerts by setting TWILIO_* variables in `.env`:
```bash
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-token
TWILIO_FROM=+1234567890
TWILIO_TO=+1234567890
```
