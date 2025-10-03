from typing import Tuple

# Each parser returns (status: str, message: str)

def parse_bgp_summary(output: str) -> Tuple[str, str]:
	if "State/Time" in output or "Establ" in output:
		if "Down" in output or "Idle" in output:
			return "error", "BGP neighbors down"
		return "ok", "BGP sessions established"
	return "unknown", "Unable to parse BGP"


def parse_isis_adjacency(output: str) -> Tuple[str, str]:
	if "Adjacency" in output or "Levels" in output:
		if "Down" in output:
			return "error", "IS-IS adjacency down"
		return "ok", "IS-IS adjacencies up"
	return "unknown", "Unable to parse IS-IS"


def parse_ldp_neighbor(output: str) -> Tuple[str, str]:
	if "Nbr" in output or "Peer" in output:
		if "oper" in output.lower() and "down" in output.lower():
			return "error", "LDP neighbor down"
		return "ok", "LDP neighbors up"
	return "unknown", "Unable to parse LDP"


def parse_interfaces_terse(output: str) -> Tuple[str, str]:
	if "up" in output.lower() and "down" in output.lower():
		return "warn", "Some interfaces down"
	if "up" in output.lower():
		return "ok", "Interfaces up"
	return "unknown", "Unable to parse interfaces"


def parse_system_alarms(output: str) -> Tuple[str, str]:
	if "No alarms" in output or "No Active alarms" in output:
		return "ok", "No system alarms"
	if output.strip():
		return "error", "Active system alarms present"
	return "unknown", "Unable to parse alarms"


def parse_chassis_hardware(output: str) -> Tuple[str, str]:
	if "Hardware inventory" in output or "Model" in output:
		return "ok", "Hardware inventory obtained"
	return "unknown", "Unable to parse hardware"


def parse_chassis_environment(output: str) -> Tuple[str, str]:
	if "temperature" in output.lower() or "fan" in output.lower():
		if "alarm" in output.lower() or "fail" in output.lower():
			return "error", "Environment issue"
		return "ok", "Environment normal"
	return "unknown", "Unable to parse environment"


def parse_system_uptime(output: str) -> Tuple[str, str]:
	if "System booted" in output or "uptime" in output.lower():
		return "ok", "Uptime parsed"
	return "unknown", "Unable to parse uptime"


def parse_route_summary(output: str) -> Tuple[str, str]:
	if "destination" in output.lower() or "routes" in output.lower():
		return "ok", "Route summary parsed"
	return "unknown", "Unable to parse route summary"


def parse_pppoe_interfaces(output: str) -> Tuple[str, str]:
	msg = "PPPoE status parsed"
	if "Session AC name" in output or "Session uptime" in output:
		return "ok", msg
	if output.strip():
		return "warn", "PPPoE info present"
	return "unknown", "Unable to parse PPPoE"
