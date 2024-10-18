// src/routes/tables.ts
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { TableSchema } from '../schemas';
import { TableController } from '../controllers/tables';
import { JSONSchema7 } from 'json-schema';

export const tableRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const tableController = new TableController();

  fastify.get('/', {
    preHandler: [fastify.authenticate],
    handler: tableController.getTables.bind(tableController)
  });

  fastify.get<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    handler: tableController.getTable.bind(tableController)
  });

  fastify.post<{ Body: { name: string; schema: JSONSchema7 } }>('/', {
    preHandler: [fastify.authenticate],
    schema: {
      body: TableSchema,
    },
    handler: tableController.createTable.bind(tableController),
  });

  fastify.put<{ Params: { id: string }; Body: { name: string; schema: JSONSchema7 } }>('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      body: TableSchema,
    },
    handler: tableController.updateTable.bind(tableController),
  });

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    handler: tableController.deleteTable.bind(tableController)
  });
};