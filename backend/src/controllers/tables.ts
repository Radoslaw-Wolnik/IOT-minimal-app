// src/controllers/tableController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Table } from '../entities/Table';
import { JSONSchema7 } from 'json-schema';

export class TableController {
  async getTables(request: FastifyRequest, reply: FastifyReply) {
    const tables = await request.server.db.getRepository(Table).find();
    reply.send(tables);
  }

  async getTable(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const table = await request.server.db.getRepository(Table).findOne({ where: { id: request.params.id } });
    if (!table) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }
    reply.send(table);
  }

  async createTable(request: FastifyRequest<{ Body: { name: string; schema: JSONSchema7 } }>, reply: FastifyReply) {
    const { name, schema } = request.body;
    const table = await request.server.db.getRepository(Table).save({ name, schema });
    reply.status(201).send(table);
  }

  async updateTable(request: FastifyRequest<{ Params: { id: string }; Body: { name: string; schema: JSONSchema7 } }>, reply: FastifyReply) {
    const { id } = request.params;
    const { name, schema } = request.body;
    const result = await request.server.db.getRepository(Table).update(id, { name, schema });
    if (result.affected === 0) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }
    reply.send({ success: true });
  }

  async deleteTable(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await request.server.db.getRepository(Table).delete(id);
    if (result.affected === 0) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }
    reply.send({ success: true });
  }
}