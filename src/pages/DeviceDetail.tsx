import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, Device, CheckResult, PingResult } from '../lib/api'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>()
  const [device, setDevice] = useState<Device | null>(null)
  const [checks, setChecks] = useState<CheckResult[]>([])
  const [pingResult, setPingResult] = useState<PingResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [pinging, setPinging] = useState(false)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDevice()
      fetchChecks()
    }
  }, [id])

  const fetchDevice = async () => {
    try {
      const response = await api.get(`/devices/${id}`)
      setDevice(response.data)
    } catch (error) {
      console.error('Failed to fetch device:', error)
    }
  }

  const fetchChecks = async () => {
    try {
      const response = await api.get(`/checks/${id}`)
      setChecks(response.data)
    } catch (error) {
      console.error('Failed to fetch checks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePing = async () => {
    if (!id) return
    setPinging(true)
    try {
      const response = await api.get(`/devices/${id}/ping`)
      setPingResult(response.data)
    } catch (error) {
      console.error('Failed to ping device:', error)
    } finally {
      setPinging(false)
    }
  }

  const handlePoll = async () => {
    if (!id) return
    setPolling(true)
    try {
      await api.post(`/checks/${id}/poll`)
      await fetchChecks()
    } catch (error) {
      console.error('Failed to poll device:', error)
    } finally {
      setPolling(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warn':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Device not found</h3>
        <Link to="/" className="mt-2 text-sm text-blue-600 hover:text-blue-500">
          Return to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{device.hostname}</h1>
            <p className="text-sm text-gray-500">{device.ip_address}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePing}
            disabled={pinging}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {pinging ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wifi className="w-4 h-4 mr-2" />
            )}
            Ping
          </button>
          <button
            onClick={handlePoll}
            disabled={polling}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {polling ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Poll Now
          </button>
        </div>
      </div>

      {pingResult && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            {pingResult.online ? (
              <Wifi className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${pingResult.online ? 'text-green-600' : 'text-red-600'}`}>
              {pingResult.online ? 'Online' : 'Offline'}
            </span>
            {pingResult.latency_ms && (
              <span className="ml-2 text-sm text-gray-500">
                ({pingResult.latency_ms.toFixed(1)}ms)
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Checks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {checks.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No checks available
            </div>
          ) : (
            checks.map((check) => (
              <div key={check.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(check.status)}
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {check.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                      {check.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(check.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                {check.message && (
                  <p className="mt-1 text-sm text-gray-600">{check.message}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
