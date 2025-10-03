import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Device } from '../lib/api'
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await api.get('/devices/')
      setDevices(response.data)
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (device: Device) => {
    if (!device.last_online) return <XCircle className="w-5 h-5 text-gray-400" />
    
    const lastOnline = new Date(device.last_online)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastOnline.getTime()) / (1000 * 60)
    
    if (diffMinutes > 5) return <XCircle className="w-5 h-5 text-red-500" />
    if (diffMinutes > 2) return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }

  const getStatusText = (device: Device) => {
    if (!device.last_online) return 'Never online'
    
    const lastOnline = new Date(device.last_online)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastOnline.getTime()) / (1000 * 60)
    
    if (diffMinutes > 5) return 'Offline'
    if (diffMinutes > 2) return 'Warning'
    return 'Online'
  }

  const getStatusColor = (device: Device) => {
    if (!device.last_online) return 'text-gray-500'
    
    const lastOnline = new Date(device.last_online)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastOnline.getTime()) / (1000 * 60)
    
    if (diffMinutes > 5) return 'text-red-500'
    if (diffMinutes > 2) return 'text-yellow-500'
    return 'text-green-500'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Device Dashboard</h1>
        <div className="text-sm text-gray-500">
          {devices.length} device{devices.length !== 1 ? 's' : ''} monitored
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No devices</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a device to monitor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <Link
              key={device.id}
              to={`/device/${device.id}`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(device)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {device.hostname}
                    </h3>
                    <p className="text-sm text-gray-500">{device.ip_address}</p>
                    {device.model && (
                      <p className="text-xs text-gray-400">{device.model}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStatusColor(device)}`}>
                      {getStatusText(device)}
                    </span>
                    {device.last_check && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(device.last_check).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
