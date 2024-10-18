import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DataController } from '../controllers/data';

export const dataRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const dataController = new DataController();

  fastify.get<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>(
    '/:tableId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['tableId'],
          properties: {
            tableId: { type: 'string' }
          }
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100 }
          }
        }
      },
      handler: (request: FastifyRequest<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>, reply: FastifyReply) =>
        dataController.getData(request, reply),
    }
  );

  fastify.post<{ Params: { tableId: string }; Body: Record<string, unknown> }>(
    '/:tableId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['tableId'],
          properties: {
            tableId: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          additionalProperties: true // This allows any JSON object as the body
        }
      },
      handler: (request: FastifyRequest<{ Params: { tableId: string }; Body: Record<string, unknown> }>, reply: FastifyReply) =>
        dataController.createData(request, reply),
    }
  );

  fastify.get<{ Params: { tableId: string } }>(
    '/:tableId/backup',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['tableId'],
          properties: {
            tableId: { type: 'string' }
          }
        }
      },
      handler: (request: FastifyRequest<{ Params: { tableId: string } }>, reply: FastifyReply) =>
        dataController.getBackup(request, reply),
    }
  );
};