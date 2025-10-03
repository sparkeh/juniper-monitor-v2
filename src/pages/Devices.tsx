import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Device } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import AddDeviceModal from '../components/AddDeviceModal'
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Plus,
  Trash2,
  Edit,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDevice, setShowAddDevice] = useState(false)
  const { user } = useAuth()

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

  const handleAddDevice = async (deviceData: any) => {
    try {
      const response = await api.post('/devices/', deviceData)
      setDevices([...devices, response.data])
      setShowAddDevice(false)
    } catch (error) {
      console.error('Failed to add device:', error)
    }
  }

  const handleDeleteDevice = async (deviceId: number) => {
    if (!confirm('Are you sure you want to delete this device?')) return
    
    try {
      await api.delete(`/devices/${deviceId}`)
      setDevices(devices.filter(d => d.id !== deviceId))
    } catch (error) {
      console.error('Failed to delete device:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowAddDevice(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </button>
        )}
      </div>

      {showAddDevice && (
        <AddDeviceModal
          onClose={() => setShowAddDevice(false)}
          onAdd={handleAddDevice}
        />
      )}

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No devices</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a device to monitor.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {devices.map((device) => (
              <li key={device.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(device)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <Link
                          to={`/device/${device.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {device.hostname}
                        </Link>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device)}`}>
                          {getStatusText(device)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">{device.ip_address}</p>
                        {device.model && (
                          <p className="text-xs text-gray-400">{device.model}</p>
                        )}
                        {device.serial_number && (
                          <p className="text-xs text-gray-400">SN: {device.serial_number}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {device.last_check && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(device.last_check).toLocaleTimeString()}
                      </div>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
