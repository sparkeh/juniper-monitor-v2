import subprocess
import platform
from typing import Tuple


def ping_host(host: str, timeout_seconds: int = 2) -> Tuple[bool, float]:
	count_flag = "-n" if platform.system().lower() == "windows" else "-c"
	timeout_flag = "-w" if platform.system().lower() == "windows" else "-W"
	cmd = ["ping", count_flag, "1", timeout_flag, str(timeout_seconds), host]
	try:
		proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_seconds + 1)
		output = proc.stdout + proc.stderr
		success = proc.returncode == 0 or ("1 received" in output.lower())
		latency = _parse_latency_ms(output)
		return success, latency
	except Exception:
		return False, 0.0


def _parse_latency_ms(output: str) -> float:
	for token in output.replace("=", " ").split():
		if token.endswith("ms"):
			try:
				return float(token.replace("ms", ""))
			except ValueError:
				continue
	return 0.0
