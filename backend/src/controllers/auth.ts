import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { AppSettings } from '../entities/AppSettings';
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

  async createDefaultAdmin(request: FastifyRequest, reply: FastifyReply) {
    const appSettingsRepo = request.server.db.getRepository(AppSettings);
    const userRepo = request.server.db.getRepository(User);

    let appSettings = await appSettingsRepo.findOne({ where: {} });

    if (!appSettings) {
      appSettings = new AppSettings();
      appSettings.isFirstRun = true;
      appSettings.adminUsername = 'admin';
      await appSettingsRepo.save(appSettings);

      const adminKey = process.env.ADMIN_KEY;
      if (!adminKey) {
        reply.status(500).send({ error: 'ADMIN_KEY not set in environment variables' });
        return;
      }

      const adminUser = new User();
      adminUser.username = 'admin';
      adminUser.passwordHash = await bcrypt.hash(adminKey, 10);
      await userRepo.save(adminUser);

      reply.send({ message: 'Default admin user created. Please change the password on first login.' });
    } else {
      reply.send({ message: 'Admin user already exists.' });
    }
  }

  async changeAdminPassword(request: FastifyRequest<{ Body: { currentPassword: string; newPassword: string } }>, reply: FastifyReply) {
    const { currentPassword, newPassword } = request.body;
    const appSettingsRepo = request.server.db.getRepository(AppSettings);
    const userRepo = request.server.db.getRepository(User);

    const appSettings = await appSettingsRepo.findOne({ where: {} });
    if (!appSettings || !appSettings.adminUsername) {
      reply.status(400).send({ error: 'Admin user not set up' });
      return;
    }

    const adminUser = await userRepo.findOne({ where: { username: appSettings.adminUsername } });
    if (!adminUser) {
      reply.status(400).send({ error: 'Admin user not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.passwordHash);
    if (!isPasswordValid) {
      reply.status(401).send({ error: 'Invalid current password' });
      return;
    }

    adminUser.passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepo.save(adminUser);

    if (appSettings.isFirstRun) {
      appSettings.isFirstRun = false;
      await appSettingsRepo.save(appSettings);
    }

    reply.send({ message: 'Admin password changed successfully' });
  }

  async isFirstRun(request: FastifyRequest, reply: FastifyReply) {
    const appSettingsRepo = request.server.db.getRepository(AppSettings);
    const appSettings = await appSettingsRepo.findOne({ where: {} });

    if (!appSettings || appSettings.isFirstRun) {
      reply.send({ isFirstRun: true });
    } else {
      reply.send({ isFirstRun: false });
    }
  }
}
