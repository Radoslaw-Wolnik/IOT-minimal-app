import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { DeviceController } from '../controllers/device';

export const deviceRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const deviceController = new DeviceController();

  fastify.get('/', {
    preHandler: [fastify.authenticate],
    handler: deviceController.getDevices
  });

  fastify.post<{ Body: { name: string } }>('/', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      }
    },
    handler: deviceController.createDevice
  });

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: deviceController.deleteDevice
  });

  fastify.post<{ Body: { apiKey: string } }>('/test-connection', {
    schema: {
      body: {
        type: 'object',
        required: ['apiKey'],
        properties: {
          apiKey: { type: 'string' }
        }
      }
    },
    handler: deviceController.testConnection
  });
};