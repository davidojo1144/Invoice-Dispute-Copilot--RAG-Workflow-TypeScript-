import { Redis } from 'ioredis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
export const redis = new Redis(url);

export async function withLock(key: string, ttlMs: number, fn: () => Promise<void>) {
  const lockKey = `lock:${key}`;
  const acquired = await redis.set(lockKey, '1', 'PX', ttlMs, 'NX');
  if (!acquired) {
    throw new Error(`lock_unavailable:${key}`);
  }
  try {
    await fn();
  } finally {
    await redis.del(lockKey);
  }
}
