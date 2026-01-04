function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

async function getDisputes(cursor?: string) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${baseUrl()}/disputes?${params.toString()}`, { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const data = await getDisputes();
  const items = data.items ?? [];
  return (
    <section className="card">
      <h2>Disputes</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d: any) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.invoiceId ?? d.invoice_id}</td>
              <td>{d.status}</td>
              <td>{d.reason ?? '-'}</td>
              <td>{d.createdAt ?? d.created_at}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} className="muted">No disputes</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
