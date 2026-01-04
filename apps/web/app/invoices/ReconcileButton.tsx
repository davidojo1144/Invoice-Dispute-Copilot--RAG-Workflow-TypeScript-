'use client';

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
      alert(`Accepted: ${json.accepted} key=${json.reconcile_key}`);
    } catch (e) {
      alert('Failed to enqueue reconciliation');
    }
  }
  return <button className="btn" onClick={handle}>Reconcile</button>;
}
