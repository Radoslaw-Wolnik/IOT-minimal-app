# IoT Dashboard Frontend

This is the frontend for the IoT Dashboard project, built with React, TypeScript, and Tailwind CSS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Styling](#styling)
- [State Management](#state-management)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/iot-dashboard.git
   cd iot-dashboard/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Formats the code using Prettier.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Folder Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/          # Page components
  ├── contexts/       # React contexts
  ├── hooks/          # Custom hooks
  ├── utils/          # Utility functions
  ├── types/          # TypeScript type definitions
  ├── services/       # API service functions
  ├── styles/         # Global styles and Tailwind config
  ├── tests/          # Test files
  ├── App.tsx         # Main App component
  └── index.tsx       # Entry point
```

## Styling

This project uses Tailwind CSS for styling. The configuration file is located at `src/styles/tailwind.config.js`.

## State Management

We use React Query for server state management and React Context for global application state.

## Testing

We use Jest and React Testing Library for unit and integration tests. Run tests with `npm test`.

## Building for Production

To create a production build, run:

```
npm run build
```

This will create a `build` folder with optimized production files.

## Deployment

For deployment, you can serve the static files in the `build` folder using any static file server. Make sure to set up the appropriate environment variables for your production environment.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.