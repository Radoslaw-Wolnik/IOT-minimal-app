# IoT Dashboard API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Auth Routes](#auth-routes)
3. [Table Routes](#table-routes)
4. [Data Routes](#data-routes)
5. [Device Routes](#device-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using JSON Web Tokens (JWT). When a user logs in successfully, the server will return a JWT. This token should be included in the Authorization header of subsequent requests to authenticated endpoints. Authentication requirement is indicated for each endpoint as follows:

- 🔓 No authentication required
- 🔒 User authentication required

## Auth Routes

#### Register
```
🔓 POST /api/auth/register
Body: { username: string, password: string }
Response: { message: "User registered successfully" }
```

#### Login
```
🔓 POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, user: { id: string, username: string } }
```

#### Logout
```
🔒 POST /api/auth/logout
Response: { message: "Logout successful" }
```

## Table Routes

#### Create Table
```
🔒 POST /api/tables
Body: { name: string, schema: object }
Response: { id: string, name: string, schema: object }
```

#### Get All Tables
```
🔒 GET /api/tables
Response: [{ id: string, name: string, schema: object }]
```

#### Get Table by ID
```
🔒 GET /api/tables/:id
Response: { id: string, name: string, schema: object }
```

#### Update Table
```
🔒 PUT /api/tables/:id
Body: { name?: string, schema?: object }
Response: { id: string, name: string, schema: object }
```

#### Delete Table
```
🔒 DELETE /api/tables/:id
Response: { message: "Table deleted successfully" }
```

## Data Routes

#### Add Data to Table
```
🔒 POST /api/data/:tableId
Body: object (matching the table schema)
Response: { id: string, ...data }
```

#### Get Data from Table
```
🔒 GET /api/data/:tableId
Query: { page?: number, limit?: number }
Response: { data: [object], meta: { total: number, page: number, limit: number, pages: number } }
```

#### Update Data in Table
```
🔒 PUT /api/data/:tableId/:dataId
Body: object (partial, matching the table schema)
Response: { id: string, ...updatedData }
```

#### Delete Data from Table
```
🔒 DELETE /api/data/:tableId/:dataId
Response: { message: "Data deleted successfully" }
```

## Device Routes

#### Register Device
```
🔒 POST /api/devices
Body: { name: string }
Response: { id: string, name: string, apiKey: string }
```

#### Get All Devices
```
🔒 GET /api/devices
Response: [{ id: string, name: string }]
```

#### Update Device
```
🔒 PUT /api/devices/:id
Body: { name: string }
Response: { id: string, name: string }
```

#### Delete Device
```
🔒 DELETE /api/devices/:id
Response: { message: "Device deleted successfully" }
```

#### Test Device Connection
```
🔓 POST /api/devices/test-connection
Body: { apiKey: string }
Response: { message: "Connection successful" }
```

## IoT Data Ingestion

IoT devices can send data to the server using the following endpoint:

```
POST /api/data/:tableId
Headers: { "X-API-Key": "device_api_key" }
Body: object (matching the table schema)
Response: { id: string, ...data }
```

This endpoint does not require JWT authentication but instead uses the device's API key for authentication. Ensure that your IoT devices are programmed to include their API key in the `X-API-Key` header when sending data to this endpoint.

## Notes on IoT Integration

1. Each IoT device should be registered using the "Register Device" endpoint to obtain an API key.
2. The API key should be securely stored on the IoT device and used for all data transmissions.
3. Ensure that your IoT devices are programmed to handle connection errors and retry mechanisms in case of network issues.
4. For real-time applications, consider implementing a WebSocket connection for bi-directional communication between the server and IoT devices.
5. Implement rate limiting on the server to prevent overwhelming the system with too many requests from a single device.