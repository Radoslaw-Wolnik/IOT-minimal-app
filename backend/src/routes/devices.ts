// src/routes/devices.ts
import { FastifyPluginAsync } from 'fastify';
import { DeviceConnectionSchema } from '../schemas';
import { DeviceController } from '../controllers/device';
import { FastifyInstance } from 'fastify';

export const deviceRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  const deviceController = new DeviceController();

  fastify.get('/', deviceController.getDevices.bind(deviceController));

  fastify.post<{ Body: { name: string } }>('/', {
    schema: {
      body: DeviceConnectionSchema,
    },
    handler: deviceController.createDevice.bind(deviceController),
  });

  fastify.delete<{ Params: { id: string } }>('/:id', deviceController.deleteDevice.bind(deviceController));

  fastify.post<{ Body: { apiKey: string } }>('/test-connection', deviceController.testConnection.bind(deviceController));
};