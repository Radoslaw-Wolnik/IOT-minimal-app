// src/pages/DashboardPage.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getTables, getDevices } from '../utils/api';
import { Table, Device, ApiError } from '../types/types';

const DashboardPage: React.FC = () => {
  const { data: tables, isLoading: tablesLoading, error: tablesError } = useQuery<Table[], ApiError>('tables', getTables);
  const { data: devices, isLoading: devicesLoading, error: devicesError } = useQuery<Device[], ApiError>('devices', getDevices);

  if (tablesLoading || devicesLoading) return <div>Loading...</div>;
  if (tablesError || devicesError) return <div>An error occurred: {(tablesError || devicesError)?.message || 'Unknown error'}</div>;


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Dashboard</h1>
      
      <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">Tables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tables?.map((table) => (
          <Link
            key={table.id}
            to={`/table/${table.id}`}
            className="bg-white dark:bg-gray-800 shadow rounded p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{table.name}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">Devices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices?.map((device) => (
          <div key={device.id} className="bg-white dark:bg-gray-800 shadow rounded p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{device.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">API Key: {device.apiKey}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;