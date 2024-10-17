// src/types/types.ts

export interface User {
    id: string;
    username: string;
  }
  
  export interface Table {
    id: string;
    name: string;
    schema: JSONSchema7;
  }
  
  export interface TableData {
    id: string;
    content: Record<string, any>;
    createdAt: string;
  }
  
  export interface Device {
    id: string;
    name: string;
    apiKey: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  export interface ApiError {
    message: string;
  }
  
  // You might need to install @types/json-schema for this type
  import { JSONSchema7 } from "json-schema";