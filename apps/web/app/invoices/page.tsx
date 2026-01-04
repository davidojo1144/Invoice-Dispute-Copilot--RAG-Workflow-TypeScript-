import { ReconcileButton } from './ReconcileButton';

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
    <section>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2>Filters</h2>
        <form method="get" action="/invoices">
          <label>Tenant ID&nbsp;<input name="tenant" defaultValue={tenant} /></label>
          &nbsp;&nbsp;
          <label>Status&nbsp;
            <select name="status" defaultValue={status ?? ''}>
              <option value="">Any</option>
              <option value="open">open</option>
              <option value="paid">paid</option>
              <option value="disputed">disputed</option>
            </select>
          </label>
          &nbsp;&nbsp;
          <button className="btn secondary" type="submit">Apply</button>
        </form>
      </div>
      <div className="card">
        <h2>Invoices</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((inv: any) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.status}</td>
                <td>{Number(inv.totalAmount ?? inv.total_amount ?? 0).toFixed(2)}</td>
                <td>{inv.version}</td>
                <td><ReconcileButton id={inv.id} /></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="muted">No invoices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
