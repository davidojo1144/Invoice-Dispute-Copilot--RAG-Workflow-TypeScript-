import Fastify from 'fastify';
import cors from '@fastify/cors';
import underPressure from '@fastify/under-pressure';
import dotenv from 'dotenv';
import { registerRoutes } from './routes';

dotenv.config();

const server = Fastify({
  logger: true,
  trustProxy: true
});

await server.register(cors, { origin: true });
await server.register(underPressure, {
  maxEventLoopDelay: 1000,
  maxHeapUsedBytes: 1e9,
  maxRssBytes: 1e9,
  message: 'Server under pressure'
});

server.get('/health', async () => ({ status: 'ok' }));
await registerRoutes(server);

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await server.listen({ port, host });
  server.log.info(`API listening on http://${host}:${port}`);
  if (process.env.REDIS_URL) {
    const { reconcileWorker } = await import('./queue/reconcile');
    reconcileWorker.on('ready', () => {
      server.log.info('Reconcile worker ready');
    });
  } else {
    server.log.warn('REDIS_URL not set; reconcile worker disabled');
  }
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
