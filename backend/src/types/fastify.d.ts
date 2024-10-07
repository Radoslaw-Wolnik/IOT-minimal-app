// src/types/fastify.d.ts

import { FastifyInstance as OriginalFastifyInstance } from 'fastify'
import { DataSource } from 'typeorm'

declare module 'fastify' {
  export interface FastifyInstance extends OriginalFastifyInstance {
    authenticate: () => Promise<void>
    db: DataSource
    jwt: {
      sign: (payload: object) => string
      verify: (token: string) => object
    }
  }
}