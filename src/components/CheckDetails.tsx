import { useState } from 'react'

interface CheckDetailsProps {
  category: string
  details: any
  rawOutput?: string
}

export default function CheckDetails({ category, details, rawOutput }: CheckDetailsProps) {
  const [showRaw, setShowRaw] = useState(false)

  const renderInterfacesTable = (interfaces: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {interfaces.map((iface, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{iface.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  iface.admin === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {iface.admin}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  iface.link === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {iface.link}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{iface.protocol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{iface.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderBgpTable = (neighbors: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {neighbors.map((neighbor, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{neighbor.peer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{neighbor.as}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  neighbor.state === 'Establ' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {neighbor.state}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{neighbor.time}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{neighbor.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderIsisTable = (adjacencies: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hold</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neighbor</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {adjacencies.map((adjacency, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adjacency.interface}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{adjacency.level}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  adjacency.state === 'Up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {adjacency.state}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{adjacency.hold}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{adjacency.neighbor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderLdpTable = (neighbors: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hold Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {neighbors.map((neighbor, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{neighbor.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{neighbor.interface}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  neighbor.state === 'oper' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {neighbor.state}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{neighbor.holdtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderAlarmsTable = (alarms: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alarms.map((alarm, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.time}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  {alarm.class}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{alarm.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderHardwareTable = (components: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {components.map((component, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{component.slot}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{component.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{component.value}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{component.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderEnvironmentTable = (sensors: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sensors.map((sensor, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sensor.item}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  sensor.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {sensor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sensor.value}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{sensor.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderRoutesTable = (routes: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Hop</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {routes.map((route, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.destination}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.protocol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.next_hop}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.interface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPppoeTable = (sessions: any[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AC Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.interface}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  session.state === 'Up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {session.state}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.ac_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.uptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderUptime = (uptime: string) => (
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm font-medium text-gray-900">System Uptime</p>
      <p className="mt-1 text-sm text-gray-600 font-mono">{uptime}</p>
    </div>
  )

  const renderDetails = () => {
    if (!details) return null

    switch (category) {
      case 'interfaces':
        return details.interfaces ? renderInterfacesTable(details.interfaces) : null
      case 'bgp':
        return details.neighbors ? renderBgpTable(details.neighbors) : null
      case 'isis':
        return details.adjacencies ? renderIsisTable(details.adjacencies) : null
      case 'ldp':
        return details.neighbors ? renderLdpTable(details.neighbors) : null
      case 'alarms':
        return details.alarms ? renderAlarmsTable(details.alarms) : null
      case 'hardware':
        return details.components ? renderHardwareTable(details.components) : null
      case 'environment':
        return details.sensors ? renderEnvironmentTable(details.sensors) : null
      case 'route':
        return details.routes ? renderRoutesTable(details.routes) : null
      case 'pppoe':
        return details.sessions ? renderPppoeTable(details.sessions) : null
      case 'uptime':
        return details.uptime ? renderUptime(details.uptime) : null
      default:
        return null
    }
  }

  if (!details) return null

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Parsed Details</h4>
        {rawOutput && (
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showRaw ? 'Hide Raw Output' : 'Show Raw Output'}
          </button>
        )}
      </div>
      
      {renderDetails()}
      
      {showRaw && rawOutput && (
        <div className="bg-gray-900 text-white p-4 rounded-md">
          <pre className="text-xs overflow-x-auto">{rawOutput}</pre>
        </div>
      )}
    </div>
  )
}
