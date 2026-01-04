function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

async function getSummary() {
  const tenant = 't1';
  const [invoicesRes, disputesRes] = await Promise.all([
    fetch(`${baseUrl()}/invoices?tenant_id=${tenant}`, { cache: 'no-store' }),
    fetch(`${baseUrl()}/disputes`, { cache: 'no-store' }),
  ]);
  const invoices = await invoicesRes.json();
  const disputes = await disputesRes.json();
  const invs = invoices.items ?? [];
  const dsps = disputes.items ?? [];
  const statusCounts = invs.reduce((acc: Record<string, number>, x: any) => {
    const s = x.status?.toLowerCase() ?? 'open';
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const byDay = dsps.reduce((acc: Record<string, number>, x: any) => {
    const d = (x.createdAt ?? x.created_at ?? '').slice(0, 10);
    if (!d) return acc;
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});
  return {
    invoicesCount: invs.length,
    disputesCount: dsps.length,
    statusCounts,
    disputesByDay: byDay,
  };
}

import DashboardCharts from './widgets/DashboardCharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default async function Page() {
  const summary = await getSummary();
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-3">Count: {summary.invoicesCount}</p>
          <a className="inline-flex items-center justify-center rounded-lg bg-primary text-white hover:bg-blue-500 h-9 px-3 py-1.5 text-sm" href="/invoices">View Invoices</a>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-3">Count: {summary.disputesCount}</p>
          <a className="inline-flex items-center justify-center rounded-lg bg-card text-fg hover:bg-[#1a2330] border border-border h-9 px-3 py-1.5 text-sm" href="/disputes">View Disputes</a>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-3">Query documents and contracts</p>
          <a className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent text-fg hover:bg-card h-9 px-3 py-1.5 text-sm" href="/search">Open Search</a>
        </CardContent>
      </Card>
      <Card className="md:col-span-3 shadow-md">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCharts statusCounts={summary.statusCounts} disputesByDay={summary.disputesByDay} />
        </CardContent>
      </Card>
    </section>
  );
}
