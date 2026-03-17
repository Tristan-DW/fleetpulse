import React from 'react';
import { VehicleMap } from '../components/VehicleMap';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export const Dashboard: React.FC = () => {
  const { data: vehicles } = useQuery({ queryKey: ['vehicles'], queryFn: api.getVehicles });

  const active = vehicles?.filter((v) => v.status === 'active').length ?? 0;

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <h1 className="text-2xl font-bold text-white">Fleet Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value={vehicles?.length ?? 0} />
        <StatCard label="Active" value={active} highlight />
        <StatCard label="Idle" value={(vehicles?.length ?? 0) - active} />
        <StatCard label="Alerts" value={0} />
      </div>

      <div className="flex-1 min-h-0">
        <VehicleMap />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`rounded-xl border p-4 ${highlight ? 'border-green-500/30 bg-green-900/20' : 'border-white/10 bg-white/5'}`}>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

export default Dashboard;
