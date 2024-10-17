// src/custom.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      // Add other environment variables here as needed
    }
  }
  