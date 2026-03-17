import type { Vehicle, Driver, Route, TelemetryPing, AnalyticsData } from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Vehicles
  getVehicles: () => request<Vehicle[]>('/vehicles'),
  getVehicle: (id: number) => request<Vehicle>(`/vehicles/${id}`),
  createVehicle: (data: Partial<Vehicle>) =>
    request<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id: number, data: Partial<Vehicle>) =>
    request<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicle: (id: number) =>
    request<void>(`/vehicles/${id}`, { method: 'DELETE' }),

  // Vehicle location & history
  getVehicleLocation: (id: number) => request<TelemetryPing>(`/vehicles/${id}/location`),
  getVehicleHistory: (id: number, from?: string, to?: string) =>
    request<TelemetryPing[]>(`/vehicles/${id}/history?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}`),

  // Drivers
  getDrivers: () => request<Driver[]>('/drivers'),
  getDriver: (id: number) => request<Driver>(`/drivers/${id}`),
  createDriver: (data: Partial<Driver>) =>
    request<Driver>('/drivers', { method: 'POST', body: JSON.stringify(data) }),
  updateDriver: (id: number, data: Partial<Driver>) =>
    request<Driver>(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Routes
  getRoutes: () => request<Route[]>('/routes'),
  createRoute: (data: Partial<Route>) =>
    request<Route>('/routes', { method: 'POST', body: JSON.stringify(data) }),
  updateRoute: (id: number, data: Partial<Route>) =>
    request<Route>(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Analytics
  getUtilization: (from?: string, to?: string) =>
    request<AnalyticsData>(`/analytics/utilization?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}`),

  // Health
  health: () => request<{ status: string; ts: number }>('/health'),
};
