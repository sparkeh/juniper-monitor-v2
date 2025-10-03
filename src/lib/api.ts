import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Device {
  id: number
  hostname: string
  ip_address: string
  ssh_port: number
  ssh_username?: string
  model?: string
  serial_number?: string
  last_online?: string
  last_check?: string
}

export interface CheckResult {
  id: number
  category: string
  status: string
  message?: string
  created_at: string
}

export interface Alert {
  id: number
  severity: string
  message: string
  acknowledged: boolean
  created_at: string
}

export interface PingResult {
  online: boolean
  latency_ms?: number
}
