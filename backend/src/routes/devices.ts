// src/routes/devices.ts
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { DeviceConnectionSchema } from '../schemas';
import { DeviceController } from '../controllers/device';

export const deviceRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const deviceController = new DeviceController();

  fastify.get('/', {
    preHandler: [fastify.authenticate],
    handler: deviceController.getDevices.bind(deviceController)
  });

  fastify.post<{ Body: { name: string } }>('/', {
    preHandler: [fastify.authenticate],
    schema: {
      body: DeviceConnectionSchema,
    },
    handler: deviceController.createDevice.bind(deviceController),
  });

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    handler: deviceController.deleteDevice.bind(deviceController)
  });

  // Depending on your requirements, you might want to authenticate this route as well
  fastify.post<{ Body: { apiKey: string } }>('/test-connection', {
    // preHandler: [fastify.authenticate], // Uncomment if authentication is required
    handler: deviceController.testConnection.bind(deviceController)
  });
};