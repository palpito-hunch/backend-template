import { z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  nodeEnv: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  port: z.coerce.number().int().positive().default(3000),
  corsOrigin: z.string().default('*'),
  databaseUrl: z.string().url(),
});

function loadConfig(): z.infer<typeof configSchema> {
  const result = configSchema.safeParse({
    nodeEnv: process.env['NODE_ENV'],
    port: process.env['PORT'],
    corsOrigin: process.env['CORS_ORIGIN'],
    databaseUrl: process.env['DATABASE_URL'],
  });

  if (!result.success) {
    console.error('Invalid configuration:', result.error.format());
    throw new Error('Invalid configuration. Check environment variables.');
  }

  return result.data;
}

export const config = loadConfig();
