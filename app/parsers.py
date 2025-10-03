from typing import Tuple, Dict, List, Any
import re

# Each parser returns (status: str, message: str, details: Dict)

def parse_bgp_summary(output: str) -> Tuple[str, str, Dict]:
	details = {"neighbors": []}
	if "State/Time" in output or "Establ" in output:
		lines = output.split('\n')
		for line in lines:
			if 'Peer' in line and 'AS' in line:
				# Header line, skip
				continue
			if 'inet.' in line or 'inet6.' in line:
				parts = line.split()
				if len(parts) >= 6:
					neighbor = {
						"peer": parts[0],
						"as": parts[1],
						"state": parts[2],
						"time": parts[3] if len(parts) > 3 else "",
						"info": " ".join(parts[4:]) if len(parts) > 4 else ""
					}
					details["neighbors"].append(neighbor)
		
		down_neighbors = [n for n in details["neighbors"] if n["state"] in ["Idle", "Down", "Active"]]
		if down_neighbors:
			return "error", f"BGP neighbors down: {len(down_neighbors)}", details
		return "ok", f"BGP sessions established: {len(details['neighbors'])}", details
	return "unknown", "Unable to parse BGP", details


def parse_isis_adjacency(output: str) -> Tuple[str, str, Dict]:
	details = {"adjacencies": []}
	if "Adjacency" in output or "Levels" in output:
		lines = output.split('\n')
		for line in lines:
			if 'Interface' in line and 'Level' in line:
				# Header line, skip
				continue
			if 'ge-' in line or 'xe-' in line or 'ae' in line:
				parts = line.split()
				if len(parts) >= 4:
					adjacency = {
						"interface": parts[0],
						"level": parts[1],
						"state": parts[2],
						"hold": parts[3] if len(parts) > 3 else "",
						"neighbor": parts[4] if len(parts) > 4 else ""
					}
					details["adjacencies"].append(adjacency)
		
		down_adjacencies = [a for a in details["adjacencies"] if a["state"] == "Down"]
		if down_adjacencies:
			return "error", f"IS-IS adjacencies down: {len(down_adjacencies)}", details
		return "ok", f"IS-IS adjacencies up: {len(details['adjacencies'])}", details
	return "unknown", "Unable to parse IS-IS", details


def parse_ldp_neighbor(output: str) -> Tuple[str, str, Dict]:
	details = {"neighbors": []}
	if "Nbr" in output or "Peer" in output:
		lines = output.split('\n')
		for line in lines:
			if 'Address' in line and 'Interface' in line:
				# Header line, skip
				continue
			if re.match(r'\d+\.\d+\.\d+\.\d+', line):
				parts = line.split()
				if len(parts) >= 3:
					neighbor = {
						"address": parts[0],
						"interface": parts[1],
						"state": parts[2],
						"holdtime": parts[3] if len(parts) > 3 else ""
					}
					details["neighbors"].append(neighbor)
		
		down_neighbors = [n for n in details["neighbors"] if "down" in n["state"].lower()]
		if down_neighbors:
			return "error", f"LDP neighbors down: {len(down_neighbors)}", details
		return "ok", f"LDP neighbors up: {len(details['neighbors'])}", details
	return "unknown", "Unable to parse LDP", details


def parse_interfaces_terse(output: str) -> Tuple[str, str, Dict]:
	details = {"interfaces": []}
	lines = output.split('\n')
	for line in lines:
		if 'Interface' in line and 'Admin' in line:
			# Header line, skip
			continue
		if 'ge-' in line or 'xe-' in line or 'ae' in line or 'lo0' in line:
			parts = line.split()
			if len(parts) >= 4:
				interface = {
					"name": parts[0],
					"admin": parts[1],
					"link": parts[2],
					"protocol": parts[3],
					"address": parts[4] if len(parts) > 4 else ""
				}
				details["interfaces"].append(interface)
	
	down_interfaces = [i for i in details["interfaces"] if i["link"] == "Down"]
	if down_interfaces:
		return "warn", f"Some interfaces down: {len(down_interfaces)}", details
	return "ok", f"Interfaces up: {len(details['interfaces'])}", details


def parse_system_alarms(output: str) -> Tuple[str, str, Dict]:
	details = {"alarms": []}
	if "No alarms" in output or "No Active alarms" in output:
		return "ok", "No system alarms", details
	
	lines = output.split('\n')
	for line in lines:
		if 'Alarm time' in line or 'Class' in line:
			# Header line, skip
			continue
		if line.strip() and not line.startswith(' '):
			parts = line.split()
			if len(parts) >= 3:
				alarm = {
					"time": parts[0],
					"class": parts[1],
					"description": " ".join(parts[2:])
				}
				details["alarms"].append(alarm)
	
	if details["alarms"]:
		return "error", f"Active system alarms: {len(details['alarms'])}", details
	return "ok", "No system alarms", details


def parse_chassis_hardware(output: str) -> Tuple[str, str, Dict]:
	details = {"components": []}
	if "Hardware inventory" in output or "Model" in output:
		lines = output.split('\n')
		current_slot = ""
		for line in lines:
			if line.startswith('FPC') or line.startswith('Routing Engine'):
				current_slot = line.strip()
			elif 'Model' in line or 'Serial' in line or 'Part' in line:
				parts = line.split()
				if len(parts) >= 2:
					component = {
						"slot": current_slot,
						"type": parts[0].rstrip(':'),
						"value": parts[1],
						"description": " ".join(parts[2:]) if len(parts) > 2 else ""
					}
					details["components"].append(component)
		
		return "ok", f"Hardware inventory: {len(details['components'])} components", details
	return "unknown", "Unable to parse hardware", details


def parse_chassis_environment(output: str) -> Tuple[str, str, Dict]:
	details = {"sensors": []}
	if "temperature" in output.lower() or "fan" in output.lower():
		lines = output.split('\n')
		for line in lines:
			if 'Item' in line and 'Status' in line:
				# Header line, skip
				continue
			if 'Temp' in line or 'Fan' in line or 'Power' in line:
				parts = line.split()
				if len(parts) >= 3:
					sensor = {
						"item": parts[0],
						"status": parts[1],
						"value": parts[2] if len(parts) > 2 else "",
						"description": " ".join(parts[3:]) if len(parts) > 3 else ""
					}
					details["sensors"].append(sensor)
		
		alarm_sensors = [s for s in details["sensors"] if "alarm" in s["status"].lower() or "fail" in s["status"].lower()]
		if alarm_sensors:
			return "error", f"Environment alarms: {len(alarm_sensors)}", details
		return "ok", f"Environment normal: {len(details['sensors'])} sensors", details
	return "unknown", "Unable to parse environment", details


def parse_system_uptime(output: str) -> Tuple[str, str, Dict]:
	details = {"uptime": ""}
	if "System booted" in output or "uptime" in output.lower():
		lines = output.split('\n')
		for line in lines:
			if "System booted" in line:
				details["uptime"] = line.strip()
				break
		return "ok", "Uptime parsed", details
	return "unknown", "Unable to parse uptime", details


def parse_route_summary(output: str) -> Tuple[str, str, Dict]:
	details = {"routes": []}
	if "destination" in output.lower() or "routes" in output.lower():
		lines = output.split('\n')
		for line in lines:
			if 'Destination' in line and 'Protocol' in line:
				# Header line, skip
				continue
			if re.match(r'\d+\.\d+\.\d+\.\d+', line) or line.startswith('default'):
				parts = line.split()
				if len(parts) >= 3:
					route = {
						"destination": parts[0],
						"protocol": parts[1],
						"next_hop": parts[2],
						"interface": parts[3] if len(parts) > 3 else ""
					}
					details["routes"].append(route)
		
		return "ok", f"Route summary: {len(details['routes'])} routes", details
	return "unknown", "Unable to parse route summary", details


def parse_pppoe_interfaces(output: str) -> Tuple[str, str, Dict]:
	details = {"sessions": []}
	if "Session AC name" in output or "Session uptime" in output:
		lines = output.split('\n')
		for line in lines:
			if 'Interface' in line and 'State' in line:
				# Header line, skip
				continue
			if 'pp0.' in line or 'pp1.' in line:
				parts = line.split()
				if len(parts) >= 4:
					session = {
						"interface": parts[0],
						"state": parts[1],
						"ac_name": parts[2] if len(parts) > 2 else "",
						"uptime": parts[3] if len(parts) > 3 else ""
					}
					details["sessions"].append(session)
		
		return "ok", f"PPPoE sessions: {len(details['sessions'])}", details
	return "unknown", "Unable to parse PPPoE", details
