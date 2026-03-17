import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useVehicleTracking } from '../hooks/useVehicleTracking';
import 'leaflet/dist/leaflet.css';

export const VehicleMap: React.FC = () => {
  const { pings, connected } = useVehicleTracking();

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10">
      <div className={`absolute top-3 right-3 z-10 rounded-full px-2 py-1 text-xs font-medium ${
        connected ? 'bg-green-900/80 text-green-300' : 'bg-red-900/80 text-red-300'
      }`}>
        {connected ? 'Live' : 'Disconnected'}
      </div>

      <MapContainer
        center={[-26.2041, 28.0473]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.from(pings.values()).map((ping) => (
          <Marker key={ping.vehicle_id} position={[ping.lat, ping.lng]}>
            <Tooltip permanent>V-{ping.vehicle_id}</Tooltip>
            <Popup>
              <strong>Vehicle {ping.vehicle_id}</strong><br />
              Speed: {ping.speed ?? 'N/A'} km/h<br />
              Last update: {new Date(ping.ts).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
