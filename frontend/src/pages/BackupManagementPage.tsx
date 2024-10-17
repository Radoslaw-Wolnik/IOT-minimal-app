// src/pages/BackupManagementPage.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { getTables, getTableDataBackup } from '../utils/api';
import { Table, ApiError } from '../types/types';

const BackupManagementPage: React.FC = () => {
  const { data: tables, isLoading, error } = useQuery<Table[], ApiError>('tables', getTables);

  const handleBackup = async (tableId: string, tableName: string) => {
    try {
      const data = await getTableDataBackup(tableId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tableName}_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error creating backup: ${(error as ApiError).message}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Backup Management</h1>
      <div className="space-y-4">
        {tables?.map((table) => (
          <div key={table.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <span className="text-lg font-medium text-gray-700 dark:text-white">{table.name}</span>
            <button
              onClick={() => handleBackup(table.id, table.name)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Download Backup
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackupManagementPage;