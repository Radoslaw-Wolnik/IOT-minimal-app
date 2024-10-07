// src/routes/auth.ts
import { FastifyPluginAsync } from 'fastify';
import { LoginRequestSchema, UserSchema } from '../schemas';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: { username: string; password: string } }>('/login', {
    schema: {
      body: LoginRequestSchema,
    },
    handler: async (request, reply) => {
      const { username, password } = request.body;
      const user = await fastify.db.getRepository(User).findOne({ where: { username } });

      if (!user || !await bcrypt.compare(password, user.passwordHash)) {
        reply.status(401).send({ error: 'Invalid credentials' });
        return;
      }

      const token = fastify.jwt.sign({ id: user.id });
      reply.send({ token });
    },
  });

  fastify.post<{ Body: { username: string; password: string } }>('/register', {
    schema: {
      body: UserSchema,
    },
    handler: async (request, reply) => {
      const { username, password } = request.body;
      const passwordHash = await bcrypt.hash(password, 10);

      try {
        const user = await fastify.db.getRepository(User).save({ username, passwordHash });
        const token = fastify.jwt.sign({ id: user.id });
        reply.send({ token });
      } catch (error) {
        if (error.code === '23505') { // unique_violation
          reply.status(409).send({ error: 'Username already exists' });
        } else {
          throw error;
        }
      }
    },
  });

  fastify.post<{ Body: { apiKey: string } }>('/refresh-device-token', {
    handler: async (request, reply) => {
      const { apiKey } = request.body;
      const device = await fastify.db.getRepository(Device).findOne({ where: { apiKey } });
      
      if (!device) {
        reply.status(401).send({ error: 'Invalid API key' });
        return;
      }
      
      const newApiKey = generateApiKey(); // Implement this function to generate a new API key
      device.apiKey = newApiKey;
      await fastify.db.getRepository(Device).save(device);
      
      reply.send({ apiKey: newApiKey });
    },
  });
};