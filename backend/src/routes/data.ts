import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DataEntrySchema, PaginationSchema } from '../schemas';
import { DataController } from '../controllers/data';

export const dataRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const dataController = new DataController();

  fastify.get<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>(
    '/:tableId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: PaginationSchema,
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
        body: DataEntrySchema,
      },
      handler: (request: FastifyRequest<{ Params: { tableId: string }; Body: Record<string, unknown> }>, reply: FastifyReply) =>
        dataController.createData(request, reply),
    }
  );

  fastify.get<{ Params: { tableId: string } }>(
    '/:tableId/backup',
    {
      preHandler: [fastify.authenticate],
      handler: (request: FastifyRequest<{ Params: { tableId: string } }>, reply: FastifyReply) =>
        dataController.getBackup(request, reply),
    }
  );
};