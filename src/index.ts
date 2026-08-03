import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadConfig } from './config/loader.js';
import { createRouter } from './router.js';
import { chatCompletionsRoute } from './routes/chat.js';
import { healthRoute } from './routes/health.js';

export async function createServer() {
  const config = await loadConfig();
  const router = createRouter(config);

  const app = Fastify({
    logger: { level: config.logLevel ?? 'info' },
  });

  await app.register(cors);
  app.register(healthRoute);
  app.register(chatCompletionsRoute, { router });

  return { app, config };
}

if (require.main === module) {
  createServer().then(({ app, config }) => {
    app.listen({ port: config.port ?? 4000, host: '0.0.0.0' }, (err) => {
      if (err) { app.log.error(err); process.exit(1); }
    });
  });
}
