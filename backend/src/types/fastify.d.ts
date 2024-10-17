import { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';

declare module 'fastify' {
  export interface FastifyInstance extends OriginalFastifyInstance {
    // Authentication method
    authenticate: () => Promise<void>;
    
    // TypeORM DataSource
    db: DataSource;

    // JWT helper methods
    jwt: {
      sign: (payload: object) => string;
      verify: (token: string) => object;
    };
  }
}
