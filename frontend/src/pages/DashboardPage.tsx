// src/pages/DashboardPage.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Table {
  id: string;
  name: string;
}

const DashboardPage: React.FC = () => {
  const { data: tables, isLoading, error } = useQuery<Table[]>('tables', () =>
    api.get('/tables').then((res) => res.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables?.map((table) => (
          <Link
            key={table.id}
            to={`/table/${table.id}`}
            className="bg-white dark:bg-gray-800 shadow rounded p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">{table.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;