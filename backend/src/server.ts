import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DataSource } from 'typeorm';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { authRoutes } from './routes/auth';
import { tableRoutes } from './routes/tables';
import { dataRoutes } from './routes/data';
import { deviceRoutes } from './routes/devices';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const createServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({ logger: true });

  // Database connection
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/entities/*.js'], // Make sure this path is correct
    synchronize: process.env.NODE_ENV !== 'production', // Disable in production
  });

  await dataSource.initialize();
  server.decorate('db', dataSource);

  // JWT Plugin
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  });

  // Authentication decorator
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  await server.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Routes
  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(tableRoutes, { prefix: '/api/tables' });
  await server.register(dataRoutes, { prefix: '/api/data' });
  await server.register(deviceRoutes, { prefix: '/api/devices' });

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });

  return server;
};