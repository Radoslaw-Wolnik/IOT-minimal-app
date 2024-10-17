// src/pages/TableCreatePage.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { createTable } from '../utils/api';
import { JSONSchema7 } from 'json-schema';

const TableCreatePage: React.FC = () => {
  const [name, setName] = useState('');
  const [schema, setSchema] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(createTable, {
    onSuccess: () => {
      queryClient.invalidateQueries('tables');
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSchema: JSONSchema7 = JSON.parse(schema);
      mutation.mutate({ name, schema: parsedSchema });
    } catch (error) {
      alert('Invalid JSON schema');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Create New Table</h1>
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
          Create Table
        </button>
      </form>
    </div>
  );
};

export default TableCreatePage;