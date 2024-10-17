// src/controllers/deviceController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Device } from '../entities/Device';
import crypto from 'crypto';

export class DeviceController {
  async getDevices(request: FastifyRequest, reply: FastifyReply) {
    const devices = await request.server.db.getRepository(Device).find();
    reply.send(devices);
  }

  async createDevice(request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) {
    const { name } = request.body;
    const apiKey = crypto.randomBytes(32).toString('hex');
    const device = await request.server.db.getRepository(Device).save({ name, apiKey });
    reply.status(201).send(device);
  }

  async deleteDevice(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await request.server.db.getRepository(Device).delete(id);
    if (result.affected === 0) {
      reply.status(404).send({ error: 'Device not found' });
      return;
    }
    reply.send({ success: true });
  }

  async testConnection(request: FastifyRequest<{ Body: { apiKey: string } }>, reply: FastifyReply) {
    const { apiKey } = request.body;
    const device = await request.server.db.getRepository(Device).findOne({ where: { apiKey } });
    if (!device) {
      reply.status(401).send({ error: 'Invalid API key' });
      return;
    }
    reply.send({ success: true, message: 'Connection successful' });
  }
}
