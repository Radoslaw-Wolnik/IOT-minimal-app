// src/schemas.ts
import { z } from 'zod';
import { JSONSchema7 } from 'json-schema';

export const UserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

export const TableSchema = z.object({
  name: z.string().min(1).max(50),
  schema: z.custom<JSONSchema7>((val) => val instanceof Object, {
    message: 'Invalid JSON Schema',
  }),
});

export const DataEntrySchema = z.record(z.string(), z.unknown());

export const DeviceConnectionSchema = z.object({
  name: z.string().min(1).max(50),
});

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const TokenRefreshSchema = z.object({
  refreshToken: z.string(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});