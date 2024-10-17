import { FastifyRequest, FastifyReply } from 'fastify';
import { Data } from '../entities/Data';
import { Table } from '../entities/Table';
import { validateData } from '../utils/validateData';

export class DataController {
  async getData(request: FastifyRequest<{ Params: { tableId: string }; Querystring: { page: number; limit: number } }>, reply: FastifyReply) {
    const { tableId } = request.params;
    const { page = 1, limit = 100 } = request.query;

    const [data, total] = await request.server.db.getRepository(Data).findAndCount({
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
  }

  async createData(request: FastifyRequest<{ Params: { tableId: string }; Body: Record<string, unknown> }>, reply: FastifyReply) {
    const { tableId } = request.params;
    const content = request.body;

    const table = await request.server.db.getRepository(Table).findOne({ where: { id: tableId } });
    if (!table) {
      reply.status(404).send({ error: 'Table not found' });
      return;
    }

    if (!validateData(table.schema, content)) {
      reply.status(400).send({ error: 'Invalid data format' });
      return;
    }

    const dataRepository = request.server.db.getRepository(Data);
    const newData = dataRepository.create({ table, content });
    const savedData = await dataRepository.save(newData);
    reply.status(201).send(savedData);
  }

  async getBackup(request: FastifyRequest<{ Params: { tableId: string } }>, reply: FastifyReply) {
    const { tableId } = request.params;
    const data = await request.server.db.getRepository(Data).find({ where: { table: { id: tableId } } });
    
    reply
      .header('Content-Disposition', `attachment; filename="${tableId}_backup.json"`)
      .send(JSON.stringify(data, null, 2));
  }
}