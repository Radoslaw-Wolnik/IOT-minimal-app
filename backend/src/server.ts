// src/server.ts
import fastify, { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from 'fastify-cors';
import { authRoutes } from './routes/auth';
import { tableRoutes } from './routes/tables';
import { dataRoutes } from './routes/data';
import { deviceRoutes } from './routes/devices';

export const createServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: true });

  // Database connection
  const connection: Connection = await createConnection();
  server.decorate('db', connection);

  // Plugins
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });
  server.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Routes
  server.register(authRoutes, { prefix: '/api/auth' });
  server.register(tableRoutes, { prefix: '/api/tables' });
  server.register(dataRoutes, { prefix: '/api/data' });
  server.register(deviceRoutes, { prefix: '/api/devices' });

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });

  return server;
};
