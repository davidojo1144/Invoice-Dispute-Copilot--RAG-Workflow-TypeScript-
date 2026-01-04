import { Queue, Worker, Job } from 'bullmq';
import { redis, withLock } from '../redis';
import { PrismaClient, DisputeStatus } from '@prisma/client';

export type ReconcileJobData = { invoiceId: string; version: number };

const queueName = 'reconcile';

export const reconcileQueue = new Queue<ReconcileJobData, any, string>(
  queueName,
  ({
    connection: redis,
    limiter: { max: 100, duration: 1000 }
  } as any)
);

const prisma = new PrismaClient();

async function processJob(job: Job<ReconcileJobData>) {
  const { invoiceId, version } = job.data;
  const lockKey = `reconcile:${invoiceId}:${version}`;

  await withLock(lockKey, 30_000, async () => {
    const reconcileKey = `${invoiceId}:${version}`;
    const existing = await prisma.dispute.findFirst({ where: { reconcileKey } });
    if (existing && existing.status === DisputeStatus.RESOLVED) {
      return;
    }
    const dispute =
      existing ??
      (await prisma.dispute.create({
        data: {
          invoiceId,
          status: DisputeStatus.RECONCILING,
          reconcileKey
        }
      }));

    const lineItems = await prisma.invoiceLineItem.findMany({ where: { invoiceId } });
    const computedTotal = lineItems.reduce((acc, li) => acc + Number(li.total), 0);
    const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } });

    const mismatch = Math.abs(Number(invoice.totalAmount) - computedTotal) > 0.01;
    if (mismatch) {
      await prisma.dispute.update({
        where: { id: dispute.id },
        data: {
          status: DisputeStatus.FAILED,
          reason: `Total mismatch: expected ${invoice.totalAmount}, got ${computedTotal}`
        }
      });
      throw new Error('partial_failure:mismatch');
    } else {
      await prisma.dispute.update({
        where: { id: dispute.id },
        data: {
          status: DisputeStatus.RESOLVED,
          reason: null
        }
      });
    }
  });
}

export const reconcileWorker = new Worker<ReconcileJobData, any, string>(
  queueName,
  processJob,
  {
    connection: redis,
    concurrency: 8
  }
);

reconcileWorker.on('failed', async (job, err) => {
  if (!job) return;
  const attempts = job.attemptsMade ?? 0;
  const max = (job.opts.attempts ?? 0) - 1;
  if (attempts >= max) {
    await prisma.reconcileDLQ.create({
      data: {
        reason: err?.message ?? 'unknown',
        payload: job.data as any,
        attempts
      }
    });
  }
});
