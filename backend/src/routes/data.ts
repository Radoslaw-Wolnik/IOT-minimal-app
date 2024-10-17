// src/routes/data.ts
import { FastifyPluginAsync } from 'fastify';
import { DataEntrySchema, PaginationSchema } from '../schemas';
import { DataController } from '../controllers/data';
import { FastifyInstance } from 'fastify';

export const dataRoutes: FastifyPluginAsync = async (fastify : FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  const dataController = new DataController();

  fastify.get<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>('/:tableId', {
    schema: {
      querystring: PaginationSchema,
    },
    handler: dataController.getData.bind(dataController),
  });

  fastify.post<{ Params: { tableId: string }; Body: object }>('/:tableId', {
    schema: {
      body: DataEntrySchema,
    },
    handler: dataController.createData.bind(dataController),
  });

  fastify.get<{ Params: { tableId: string } }>('/:tableId/backup', {
    handler: dataController.getBackup.bind(dataController),
  });
};
