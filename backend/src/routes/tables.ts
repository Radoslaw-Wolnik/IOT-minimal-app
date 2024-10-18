import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { TableController } from '../controllers/tables';
import { JSONSchema7 } from 'json-schema';

export const tableRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const tableController = new TableController();

  fastify.get('/', {
    preHandler: [fastify.authenticate],
    handler: tableController.getTables
  });

  fastify.get<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    handler: tableController.getTable
  });

  fastify.post<{ Body: { name: string; schema: JSONSchema7 } }>('/', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'schema'],
        properties: {
          name: { type: 'string' },
          schema: { 
            type: 'object',
            additionalProperties: true // This allows any valid JSON Schema
          }
        }
      }
    },
    handler: tableController.createTable
  });

  fastify.put<{ Params: { id: string }; Body: { name: string; schema: JSONSchema7 } }>('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'schema'],
        properties: {
          name: { type: 'string' },
          schema: { 
            type: 'object',
            additionalProperties: true // This allows any valid JSON Schema
          }
        }
      }
    },
    handler: tableController.updateTable
  });

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    handler: tableController.deleteTable
  });
};