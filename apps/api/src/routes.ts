import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(server: FastifyInstance) {
  server.get('/invoices', async (req) => {
    const query = req.query as { tenant_id: string; status?: string; cursor?: string };
    const take = 50;
    const where: any = { tenantId: query.tenant_id };
    if (query.status) where.status = query.status.toUpperCase();
    const cursorId = query.cursor;
    const items = await prisma.invoice.findMany({
      where,
      orderBy: { id: 'asc' },
      take,
      ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {})
    });
    const next_cursor = items.length === take ? items[items.length - 1].id : null;
    return { items, next_cursor };
  });

  server.get('/disputes', async (req) => {
    const query = req.query as { cursor?: string };
    const take = 50;
    const cursorId = query.cursor;
    const items = await prisma.dispute.findMany({
      orderBy: { id: 'asc' },
      take,
      ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {})
    });
    const next_cursor = items.length === take ? items[items.length - 1].id : null;
    return { items, next_cursor };
  });

  server.post('/disputes/:id/reconcile', async (req, reply) => {
    const params = req.params as { id: string };
    const body = req.body as { version: number };
    const invoiceId = params.id;
    const version = body.version;
    const { reconcileQueue } = await import('./queue/reconcile.js');
    await reconcileQueue.add(
      'reconcileInvoice',
      { invoiceId, version },
      {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 6,
        backoff: { type: 'exponential', delay: 1000 }
      }
    );
    return reply.send({ reconcile_key: `${invoiceId}:${version}`, accepted: true });
  });

  server.post('/dlq/:id/redrive', async (req, reply) => {
    const params = req.params as { id: string };
    const dlq = await (prisma as any).reconcileDLQ.findUnique({ where: { id: params.id } });
    if (!dlq) {
      return reply.status(404).send({ error: 'not_found' });
    }
    const payload = dlq.payload as any;
    const { reconcileQueue } = await import('./queue/reconcile.js');
    await reconcileQueue.add('reconcileInvoice', payload, {
      attempts: 6,
      backoff: { type: 'exponential', delay: 1000 }
    });
    await (prisma as any).reconcileDLQ.update({
      where: { id: params.id },
      data: { redrivenAt: new Date() }
    });
    return reply.send({ redriven: true });
  });

  server.get('/search', async (req) => {
    const query = req.query as { query: string };
    return { query: query.query, hits: [] };
  });
}
