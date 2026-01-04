import { ReconcileButton } from './ReconcileButton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TBody, THead, TH, TR, TD } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import DataTable, { Column } from '../../components/ui/data-table';

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

async function getInvoices(tenantId: string, status?: string, cursor?: string) {
  const params = new URLSearchParams({ tenant_id: tenantId });
  if (status) params.set('status', status);
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${baseUrl()}/invoices?${params.toString()}`, { cache: 'no-store' });
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: { tenant?: string; status?: string };
}) {
  const tenant = searchParams.tenant ?? 't1';
  const status = searchParams.status;
  const data = await getInvoices(tenant, status);
  const items = data.items ?? [];
  return (
    <section className="space-y-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" action="/invoices" className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs text-muted">Tenant ID</label>
              <Input name="tenant" defaultValue={tenant} />
            </div>
            <div>
              <label className="text-xs text-muted">Status</label>
              <Select name="status" defaultValue={status ?? ''}>
                <option value="">Any</option>
                <option value="open">open</option>
                <option value="paid">paid</option>
                <option value="disputed">disputed</option>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted">Apply</label>
              <button className="rounded-lg bg-primary text-white hover:bg-blue-500 h-10 px-4 text-sm w-full" type="submit">Apply</button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const columns: Column<any>[] = [
              { key: 'id', header: 'ID' },
              { key: 'status', header: 'Status' },
              { key: 'total', header: 'Total', render: (r) => Number(r.totalAmount ?? r.total_amount ?? 0).toFixed(2) },
              { key: 'version', header: 'Version' },
              { key: 'actions', header: 'Actions', render: (r) => <ReconcileButton id={r.id} /> }
            ];
            return <DataTable data={items} columns={columns} pageSize={10} emptyMessage="No invoices" />;
          })()}
        </CardContent>
      </Card>
    </section>
  );
}
