// src/routes/devices.ts
import { FastifyPluginAsync } from 'fastify';
import { DeviceConnectionSchema } from '../schemas';
import { Device } from '../entities/Device';
import crypto from 'crypto';

export const deviceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', async (request, reply) => {
    const devices = await fastify.db.getRepository(Device).find();
    reply.send(devices);
  });

  fastify.post<{ Body: { name: string } }>('/', {
    schema: {
      body: DeviceConnectionSchema,
    },
    handler: async (request, reply) => {
      const { name } = request.body;
      const apiKey = crypto.randomBytes(32).toString('hex');
      const device = await fastify.db.getRepository(Device).save({ name, apiKey });
      reply.status(201).send(device);
    },
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const result = await fastify.db.getRepository(Device).delete(id);
    if (result.affected === 0) {
      reply.status(404).send({ error: 'Device not found' });
      return;
    }
    reply.send({ success: true });
  });

  fastify.post<{ Body: { apiKey: string } }>('/test-connection', async (request, reply) => {
    const { apiKey } = request.body;
    const device = await fastify.db.getRepository(Device).findOne({ where: { apiKey } });
    if (!device) {
      reply.status(401).send({ error: 'Invalid API key' });
      return;
    }
    reply.send({ success: true, message: 'Connection successful' });
  });
};

// src/plugins/auth.ts
import fp from 'fastify-plugin';
import { FastifyRequest } from 'fastify';

export default fp(async (fastify) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});