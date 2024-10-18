import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const authController = new AuthController();

  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    },
    handler: authController.login
  });

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    },
    handler: authController.register
  });

  fastify.post('/refresh-device-token', {
    schema: {
      body: {
        type: 'object',
        required: ['apiKey'],
        properties: {
          apiKey: { type: 'string' }
        }
      }
    },
    handler: authController.refreshDeviceToken
  });

  fastify.post('/create-default-admin', {
    handler: authController.createDefaultAdmin
  });

  fastify.post('/change-admin-password', {
    schema: {
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string' }
        }
      }
    },
    handler: authController.changeAdminPassword
  });

  fastify.get('/is-first-run', {
    handler: authController.isFirstRun
  });
};