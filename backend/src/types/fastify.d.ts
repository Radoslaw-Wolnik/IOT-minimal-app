import { FastifyInstance as OriginalFastifyInstance } from 'fastify'
import { DataSource } from 'typeorm'
import { JwtPayload } from '@fastify/jwt'

declare module 'fastify' {
  export interface FastifyInstance extends OriginalFastifyInstance {
    authenticate: () => Promise<void>
    db: DataSource
    jwt: {
      sign: (payload: object) => string
      verify: <T extends JwtPayload = JwtPayload>(token: string) => Promise<T>
    }
  }
}