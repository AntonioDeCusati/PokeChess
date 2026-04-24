import { createApp } from './app';
import { env } from './env';
import { prisma } from './db';

async function main() {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(
      `[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
    );
  });

  const shutdown = async (signal: string) => {
    console.log(`[api] ${signal} received, shutting down...`);
    server.close(() => console.log('[api] http server closed'));
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[api] fatal:', err);
  process.exit(1);
});
