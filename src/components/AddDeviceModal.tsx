import { useState } from 'react'
import { X } from 'lucide-react'

interface AddDeviceModalProps {
  onClose: () => void
  onAdd: (deviceData: any) => void
}

export default function AddDeviceModal({ onClose, onAdd }: AddDeviceModalProps) {
  const [formData, setFormData] = useState({
    hostname: '',
    ip_address: '',
    ssh_port: 22,
    ssh_username: '',
    ssh_password: '',
    ssh_private_key_path: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAdd(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 22 : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Device</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hostname *
            </label>
            <input
              type="text"
              name="hostname"
              required
              value={formData.hostname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="mx204-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              IP Address *
            </label>
            <input
              type="text"
              name="ip_address"
              required
              value={formData.ip_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="192.0.2.10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SSH Port
            </label>
            <input
              type="number"
              name="ssh_port"
              value={formData.ssh_port}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SSH Username
            </label>
            <input
              type="text"
              name="ssh_username"
              value={formData.ssh_username}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="netops"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SSH Password
            </label>
            <input
              type="password"
              name="ssh_password"
              value={formData.ssh_password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SSH Private Key Path
            </label>
            <input
              type="text"
              name="ssh_private_key_path"
              value={formData.ssh_private_key_path}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="/path/to/private/key"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
