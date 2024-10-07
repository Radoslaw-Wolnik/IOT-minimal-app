// src/utils/validateData.ts
import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';

const ajv = new Ajv();

export function validateData(schema: JSONSchema7, data: unknown): boolean {
  const validate = ajv.compile(schema);
  return validate(data) as boolean;
}