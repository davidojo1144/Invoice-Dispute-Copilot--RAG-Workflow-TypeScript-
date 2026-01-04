'use client';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';

export function ReconcileButton({ id }: { id: string }) {
  async function handle() {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${base}/disputes/${id}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: 1 }),
      });
      const json = await res.json();
      toast.success(`Accepted: ${json.reconcile_key}`);
    } catch {
      toast.error('Failed to enqueue reconciliation');
    }
  }
  return <Button onClick={handle}>Reconcile</Button>;
}
