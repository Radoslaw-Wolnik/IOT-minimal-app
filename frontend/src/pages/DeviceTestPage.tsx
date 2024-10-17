// src/pages/DeviceTestPage.tsx
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { testDeviceConnection } from '../utils/api';
import { ApiError } from '../types/types';

const DeviceTestPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  const mutation = useMutation<{ success: boolean; message: string }, ApiError, string>(testDeviceConnection, {
    onSuccess: (data) => {
      setResult(data.message);
    },
    onError: () => {
      setResult('Connection failed');
    },
  });

  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(apiKey);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Device Test</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="apiKey">
            API Key
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Test Connection
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">Result:</h2>
          <p className="text-gray-600 dark:text-gray-400">{result}</p>
        </div>
      )}
    </div>
  );
};

export default DeviceTestPage;