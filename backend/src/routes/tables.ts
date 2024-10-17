// src/routes/tables.ts
import { FastifyPluginAsync } from 'fastify';
import { TableSchema } from '../schemas';
import { TableController } from '../controllers/tables';
import { JSONSchema7 } from 'json-schema';

export const tableRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  const tableController = new TableController();

  fastify.get('/', tableController.getTables.bind(tableController));

  fastify.get<{ Params: { id: string } }>('/:id', tableController.getTable.bind(tableController));

  fastify.post<{ Body: { name: string; schema: JSONSchema7 } }>('/', {
    schema: {
      body: TableSchema,
    },
    handler: tableController.createTable.bind(tableController),
  });

  fastify.put<{ Params: { id: string }; Body: { name: string; schema: JSONSchema7 } }>('/:id', {
    schema: {
      body: TableSchema,
    },
    handler: tableController.updateTable.bind(tableController),
  });

  fastify.delete<{ Params: { id: string } }>('/:id', tableController.deleteTable.bind(tableController));
};