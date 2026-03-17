import { useEffect, useRef, useState } from 'react';

export interface VehiclePing {
  vehicle_id: number;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  ts: string;
}

export function useVehicleTracking() {
  const [pings, setPings] = useState<Map<number, VehiclePing>>(new Map());
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:3000/ws`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (e) => {
      try {
        const ping: VehiclePing = JSON.parse(e.data);
        setPings((prev) => new Map(prev).set(ping.vehicle_id, ping));
      } catch {}
    };

    return () => ws.close();
  }, []);

  return { pings, connected };
}
