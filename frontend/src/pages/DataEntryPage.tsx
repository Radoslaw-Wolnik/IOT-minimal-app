// src/pages/DataEntryPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTable, createTableData } from '../utils/api';
import { Table, ApiError } from '../types/types';

const DataEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  const { data: table, isLoading, error } = useQuery<Table, ApiError>(['table', id], () => getTable(id!));

  const mutation = useMutation(
    (data: { tableId: string; data: Record<string, any> }) => createTableData(data.tableId, data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tableData', id]);
        setFormData({});
        alert('Data submitted successfully!');
      },
      onError: (error: ApiError) => {
        alert(`Error submitting data: ${error.message}`);
      },
    }
  );

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      mutation.mutate({ tableId: id, data: formData });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!table) return <div>Table not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Data Entry: {table.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(table.schema.properties || {}).map(([key, prop]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {key}
            </label>
            <input
              type={(prop as any).type === 'number' ? 'number' : 'text'}
              id={key}
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required={(table.schema.required || []).includes(key)}
            />
          </div>
        ))}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Submitting...' : 'Submit Data'}
        </button>
      </form>
    </div>
  );
};

export default DataEntryPage;