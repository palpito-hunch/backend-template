import { createApp } from './app.js';
import { config } from './config.js';

async function main(): Promise<void> {
  const app = createApp();

  app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
    console.info(`Environment: ${config.nodeEnv}`);
  });
}

main().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
