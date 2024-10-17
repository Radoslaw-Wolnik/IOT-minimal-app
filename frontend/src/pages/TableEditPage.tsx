// src/pages/TableEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTable, updateTable } from '../utils/api';
import { Table, ApiError } from '../types/types';

const TableEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [schema, setSchema] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: table, isLoading, error } = useQuery<Table, ApiError>(['table', id], () => getTable(id!));

  useEffect(() => {
    if (table) {
      setName(table.name);
      setSchema(JSON.stringify(table.schema, null, 2));
    }
  }, [table]);

  const mutation = useMutation<Table, ApiError, { id: string; table: Partial<Table> }>(
    ({ id, table }) => updateTable(id, table),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['table', id]);
        navigate('/');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSchema = JSON.parse(schema);
      mutation.mutate({ id: id!, table: { name, schema: parsedSchema } });
    } catch (error) {
      alert('Invalid JSON schema');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;


  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Edit Table</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Table Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="schema" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Schema
          </label>
          <textarea
            id="schema"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Table
        </button>
      </form>
    </div>
  );
};

export default TableEditPage;