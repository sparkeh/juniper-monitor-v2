import paramiko
from typing import Tuple
from contextlib import contextmanager

class SSHClient:
	def __init__(self, hostname: str, port: int = 22, username: str = None, password: str = None, key_filename: str = None, timeout: int = 10):
		self.hostname = hostname
		self.port = port
		self.username = username
		self.password = password
		self.key_filename = key_filename
		self.timeout = timeout

	@contextmanager
	def connect(self):
		client = paramiko.SSHClient()
		client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
		try:
			client.connect(
				hostname=self.hostname,
				port=self.port,
				username=self.username,
				password=self.password,
				key_filename=self.key_filename,
				timeout=self.timeout,
				look_for_keys=False,
				allow_agent=False,
			)
			yield client
		finally:
			try:
				client.close()
			except Exception:
				pass

	def run_command(self, command: str) -> Tuple[int, str, str]:
		with self.connect() as client:
			stdin, stdout, stderr = client.exec_command(command, timeout=self.timeout)
			out = stdout.read().decode("utf-8", errors="ignore")
			err = stderr.read().decode("utf-8", errors="ignore")
			return stdout.channel.recv_exit_status(), out, err
