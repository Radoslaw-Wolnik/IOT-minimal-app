import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { Device } from '../entities/Device';
import { generateApiKey } from '../utils/apiKey';
import { QueryFailedError } from 'typeorm';

// Custom type for database errors
interface DatabaseError extends Error {
  code?: string;
}

export class AuthController {
  async login(request: FastifyRequest<{ Body: { username: string; password: string } }>, reply: FastifyReply) {
    const { username, password } = request.body;
    const user = await request.server.db.getRepository(User).findOne({ where: { username } });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      reply.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    const token = request.server.jwt.sign({ id: user.id });
    reply.send({ token });
  }

  async register(request: FastifyRequest<{ Body: { username: string; password: string } }>, reply: FastifyReply) {
    const { username, password } = request.body;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await request.server.db.getRepository(User).save({ username, passwordHash });
      const token = request.server.jwt.sign({ id: user.id });
      reply.send({ token });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const dbError = error as DatabaseError;
        if (dbError.code === '23505') { // unique_violation
          reply.status(409).send({ error: 'Username already exists' });
          return;
        }
      }
      // If it's not a unique violation, re-throw the error
      throw error;
    }
  }

  async refreshDeviceToken(request: FastifyRequest<{ Body: { apiKey: string } }>, reply: FastifyReply) {
    const { apiKey } = request.body;
    const device = await request.server.db.getRepository(Device).findOne({ where: { apiKey } });
    
    if (!device) {
      reply.status(401).send({ error: 'Invalid API key' });
      return;
    }
    
    const newApiKey = generateApiKey();
    device.apiKey = newApiKey;
    await request.server.db.getRepository(Device).save(device);
    
    reply.send({ apiKey: newApiKey });
  }
}