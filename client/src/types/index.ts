// Vehicle
export interface Vehicle {
  id: number;
  plate: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'inactive' | 'maintenance';
  driver?: Driver;
  created_at: string;
}

// Driver
export interface Driver {
  id: number;
  name: string;
  email: string;
  license_no: string;
  vehicle_id: number | null;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
}

// Route
export interface Route {
  id: number;
  name: string;
  waypoints: Waypoint[];
  vehicle_id: number | null;
  driver_id: number | null;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Waypoint {
  lat: number;
  lng: number;
  label?: string;
  order: number;
}

// Telemetry
export interface TelemetryPing {
  vehicle_id: number;
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
  recorded_at: string;
}

// Analytics
export interface AnalyticsData {
  total_vehicles: number;
  active_vehicles: number;
  total_distance_km: number;
  avg_speed_kmh: number;
  utilization_pct: number;
  trips_completed: number;
  alerts_triggered: number;
  period: { from: string; to: string };
}

// Auth
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'driver';
}

// UI
export type SortDirection = 'asc' | 'desc';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}
