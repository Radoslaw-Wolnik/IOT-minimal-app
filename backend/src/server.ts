// src/server.ts
import fastify, { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { authRoutes } from './routes/auth';
import { tableRoutes } from './routes/tables';
import { dataRoutes } from './routes/data';
import { deviceRoutes } from './routes/devices';

export const createServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: true });

  // Database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'your_database',
    entities: ['src/entities/*.ts'],
    synchronize: true, // Be careful with this in production
  });

  await dataSource.initialize();
  server.decorate('db', dataSource);

  // Plugins
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  await server.register(fastifyCors, {
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