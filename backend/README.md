# IoT Dashboard

A lightweight, self-hosted IoT dashboard for collecting, storing, and visualizing data from IoT devices.

## Features

- User authentication and authorization
- Dynamic table creation for different types of IoT data
- Flexible schema definition for tables
- RESTful API for data ingestion and retrieval
- Device management with API key authentication
- Responsive web interface for data visualization
- Dark mode support

## Tech Stack

- Backend: Node.js with Fastify and TypeScript
- Frontend: React with TypeScript and Tailwind CSS
- Database: PostgreSQL
- ORM: TypeORM
- Authentication: JSON Web Tokens (JWT)

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/iot-dashboard.git
   cd iot-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/iot_dashboard
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run database migrations:
   ```
   npm run typeorm migration:run
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Start the server:
   ```
   npm start
   ```

The server should now be running on `http://localhost:3000`.

## Usage

1. Register a new user account through the web interface or API.
2. Log in to access the dashboard.
3. Create tables to define the structure of your IoT data.
4. Register IoT devices and obtain API keys.
5. Configure your IoT devices to send data to the appropriate endpoints using their API keys.
6. View and analyze your IoT data through the web interface.

For detailed API documentation, please refer to the [API.md](API.md) file.

## Development

To run the project in development mode with hot reloading:

1. Start the backend development server:
   ```
   npm run dev:server
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run dev:client
   ```

The backend will be available at `http://localhost:3000`, and the frontend will be served at `http://localhost:3001`.

## Testing

Run the test suite with:

```
npm test
```

## Deployment

For production deployment:

1. Build the project:
   ```
   npm run build
   ```

2. Set the `NODE_ENV` environment variable to `production`.

3. Ensure all necessary environment variables are set.

4. Start the server:
   ```
   npm start
   ```

Consider using a process manager like PM2 for production deployments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.