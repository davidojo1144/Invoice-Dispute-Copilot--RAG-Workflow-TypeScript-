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
      <div className="md:col-span-3 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-transparent p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-gray-600 dark:text-muted">Track invoices, disputes, and documents.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
              <div className="text-xs text-gray-500 dark:text-muted">Invoices</div>
              <div className="text-lg font-semibold">{summary.invoicesCount}</div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
              <div className="text-xs text-gray-500 dark:text-muted">Disputes</div>
              <div className="text-lg font-semibold">{summary.disputesCount}</div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
              <div className="text-xs text-gray-500 dark:text-muted">Open</div>
              <div className="text-lg font-semibold">{summary.statusCounts.open ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
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
