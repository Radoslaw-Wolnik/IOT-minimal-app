import { FastifyPluginAsync } from 'fastify';
import { LoginRequestSchema, UserSchema } from '../schemas';
import { AuthController } from '../controllers/auth';
import { FastifyInstance } from 'fastify';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const authController = new AuthController();

  // Login Route
  const loginOpts = {
    schema: {
      body: LoginRequestSchema
    }
  };
  fastify.post('/login', loginOpts, authController.login);

  // Register Route
  const registerOpts = {
    schema: {
      body: UserSchema
    }
  };
  fastify.post('/register', registerOpts, authController.register);

  // Refresh Device Token Route
  fastify.post('/refresh-device-token', {
    handler: authController.refreshDeviceToken
  });
};
