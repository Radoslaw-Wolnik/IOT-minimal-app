// src/pages/TableViewPage.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

interface TableData {
  id: string;
  content: Record<string, any>;
  createdAt: string;
}

interface TableViewParams {
  id: string;
}

const TableViewPage: React.FC = () => {
  const { id } = useParams<TableViewParams>();
  const { data, isLoading, error } = useQuery<TableData[]>(['tableData', id], () =>
    api.get(`/data/${id}`).then((res) => res.data.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Table View</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              {data && data.length > 0 && Object.keys(data[0].content).map((key) => (
                <th key={key} className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {key}
                </th>
              ))}
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={row.id}>
                {Object.values(row.content).map((value, index) => (
                  <td key={index} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-700 text-sm leading-5 text-gray-500 dark:text-gray-400">
                    {JSON.stringify(value)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-700 text-sm leading-5 text-gray-500 dark:text-gray-400">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableViewPage;