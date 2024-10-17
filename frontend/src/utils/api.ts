// src/utils/api.ts
import axios from 'axios';
import { 
  User, 
  Table, 
  TableData, 
  Device, 
  LoginCredentials, 
  AuthResponse, 
  PaginationParams, 
  ApiError 
} from '../types/types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => 
  (await api.post<AuthResponse>('/auth/login', credentials)).data;

export const register = async (credentials: LoginCredentials): Promise<AuthResponse> => 
  (await api.post<AuthResponse>('/auth/register', credentials)).data;

// Tables
export const getTables = async (): Promise<Table[]> => 
  (await api.get<Table[]>('/tables')).data;

export const getTable = async (id: string): Promise<Table> => 
  (await api.get<Table>(`/tables/${id}`)).data;

export const createTable = async (table: Omit<Table, 'id'>): Promise<Table> => 
  (await api.post<Table>('/tables', table)).data;

export const updateTable = async (id: string, table: Partial<Table>): Promise<Table> => 
  (await api.put<Table>(`/tables/${id}`, table)).data;

export const deleteTable = async (id: string): Promise<void> => 
  (await api.delete(`/tables/${id}`)).data;

// Data
export const getTableData = async (tableId: string, params?: PaginationParams): Promise<TableData[]> => 
  (await api.get<TableData[]>(`/data/${tableId}`, { params })).data;

export const createTableData = async (tableId: string, data: Record<string, any>): Promise<TableData> => 
  (await api.post<TableData>(`/data/${tableId}`, data)).data;

export const getTableDataBackup = async (tableId: string): Promise<TableData[]> => 
  (await api.get<TableData[]>(`/data/${tableId}/backup`)).data;

// Devices
export const getDevices = async (): Promise<Device[]> => 
  (await api.get<Device[]>('/devices')).data;

export const createDevice = async (name: string): Promise<Device> => 
  (await api.post<Device>('/devices', { name })).data;

export const deleteDevice = async (id: string): Promise<void> => 
  (await api.delete(`/devices/${id}`)).data;

export const testDeviceConnection = async (apiKey: string): Promise<{ success: boolean; message: string }> => 
  (await api.post<{ success: boolean; message: string }>('/devices/test-connection', { apiKey })).data;

export const refreshDeviceToken = async (apiKey: string): Promise<{ apiKey: string }> => 
  (await api.post<{ apiKey: string }>('/auth/refresh-device-token', { apiKey })).data;

export default api;