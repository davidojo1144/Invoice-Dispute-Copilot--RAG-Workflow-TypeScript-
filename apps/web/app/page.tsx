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
  return {
    invoicesCount: (invoices.items ?? []).length,
    disputesCount: (disputes.items ?? []).length,
  };
}

export default async function Page() {
  const summary = await getSummary();
  return (
    <section className="grid">
      <div className="card">
        <h2>Invoices</h2>
        <p className="muted">Count: {summary.invoicesCount}</p>
        <a className="btn" href="/invoices">View Invoices</a>
      </div>
      <div className="card">
        <h2>Disputes</h2>
        <p className="muted">Count: {summary.disputesCount}</p>
        <a className="btn" href="/disputes">View Disputes</a>
      </div>
      <div className="card">
        <h2>Search</h2>
        <p className="muted">Query documents and contracts</p>
        <a className="btn" href="/search">Open Search</a>
      </div>
    </section>
  );
}
