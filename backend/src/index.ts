// src/index.ts
import { createServer } from './server';

const start = async () => {
  try {
    const server = await createServer();
    await server.listen(3000, '0.0.0.0');
    console.log(`Server listening on ${server.server.address().port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();