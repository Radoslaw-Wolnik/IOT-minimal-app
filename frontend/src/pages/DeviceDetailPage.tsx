// src/pages/DeviceDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getDevices, refreshDeviceToken } from '../utils/api';
import { Device, ApiError } from '../types/types';

const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: devices, isLoading, error } = useQuery<Device[], ApiError>('devices', getDevices);
  const device = devices?.find(d => d.id === id);

  const mutation = useMutation<{ apiKey: string }, ApiError, string>(refreshDeviceToken, {
    onSuccess: (data) => {
      queryClient.setQueryData<Device[]>('devices', (oldDevices) => 
        oldDevices?.map(d => d.id === id ? { ...d, apiKey: data.apiKey } : d) ?? []
      );
    },
  });

  const handleRefreshToken = () => {
    if (device) {
      mutation.mutate(device.apiKey);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!device) return <div>Device not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Device Details</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">{device.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">API Key: {device.apiKey}</p>
        <button
          onClick={handleRefreshToken}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Refresh API Key
        </button>
      </div>
    </div>
  );
};

export default DeviceDetailPage;