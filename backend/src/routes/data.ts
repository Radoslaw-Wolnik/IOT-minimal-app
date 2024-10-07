// src/routes/data.ts
import { FastifyPluginAsync } from 'fastify';
import { DataEntrySchema, PaginationSchema } from '../schemas';
import { Data } from '../entities/Data';
import { Table } from '../entities/Table';
import { validateData } from '../utils/validateData';

export const dataRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>('/:tableId', {
    schema: {
      querystring: PaginationSchema,
    },
    handler: async (request, reply) => {
      const { tableId } = request.params;
      const { page = 1, limit = 100 } = request.query;

      const [data, total] = await fastify.db.getRepository(Data).findAndCount({
        where: { table: { id: tableId } },
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'DESC' },
      });

      reply.send({
        data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    },
  });

  fastify.post<{ Params: { tableId: string }; Body: object }>('/:tableId', {
    schema: {
      body: DataEntrySchema,
    },
    handler: async (request, reply) => {
      const { tableId } = request.params;
      const content = request.body;

      const table = await fastify.db.getRepository(Table).findOne(tableId);
      if (!table) {
        reply.status(404).send({ error: 'Table not found' });
        return;
      }

      if (!validateData(table.schema, content)) {
        reply.status(400).send({ error: 'Invalid data format' });
        return;
      }

      const data = await fastify.db.getRepository(Data).save({ table, content });
      reply.status(201).send(data);
    },
  });

  fastify.get<{ Params: { tableId: string } }>('/:tableId/backup', {
    handler: async (request, reply) => {
      const { tableId } = request.params;
      const data = await fastify.db.getRepository(Data).find({ where: { table: { id: tableId } } });
      
      reply
        .header('Content-Disposition', `attachment; filename="${tableId}_backup.json"`)
        .send(JSON.stringify(data, null, 2));
    },
  });
  
};