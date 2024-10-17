import 'reflect-metadata';
import { createServer } from './server';
import { FastifyInstance } from 'fastify';

const start = async () => {
  try {
    const server: FastifyInstance = await createServer();
    
    await server.listen({ port: 3000, host: '0.0.0.0' });
    
    const address = server.server.address();
    if (address && typeof address === 'object') {
      console.log(`Server listening on http://${address.address}:${address.port}`);
    } else {
      console.log('Server is listening');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();