// src/routes/tables.ts
import { FastifyPluginAsync } from 'fastify';
import { TableSchema } from '../schemas';
import { Table } from '../entities/Table';
import { JSONSchema7 } from 'json-schema';

export const tableRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', async (request, reply) => {
    const tables = await fastify.db.getRepository(Table).find();
    reply.send(tables);
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const table = await fastify.db.getRepository(Table).findOne(request.params.id);
    if (!table) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }
    reply.send(table);
  });

  fastify.post<{ Body: { name: string; schema: JSONSchema7 } }>('/', {
    schema: {
      body: TableSchema,
    },
    handler: async (request, reply) => {
      const { name, schema } = request.body;
      const table = await fastify.db.getRepository(Table).save({ name, schema });
      reply.status(201).send(table);
    },
  });

  fastify.put<{ Params: { id: string }; Body: { name: string; schema: JSONSchema7 } }>('/:id', {
    schema: {
      body: TableSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { name, schema } = request.body;
      const result = await fastify.db.getRepository(Table).update(id, { name, schema });
      if (result.affected === 0) {
        reply.status(404).send({ error: 'Table not found' });
        return;
      }
      reply.send({ success: true });
    },
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const result = await fastify.db.getRepository(Table).delete(id);
    if (result.affected === 0) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }
    reply.send({ success: true });
  });
};