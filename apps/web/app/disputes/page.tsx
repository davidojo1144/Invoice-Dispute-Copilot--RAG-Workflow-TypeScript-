function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

async function getDisputes(cursor?: string) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${baseUrl()}/disputes?${params.toString()}`, { cache: 'no-store' });
  return res.json();
}

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TBody, THead, TH, TR, TD } from '../../components/ui/table';

export default async function Page() {
  const data = await getDisputes();
  const items = data.items ?? [];
  return (
    <section className="space-y-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Invoice</TH>
                <TH>Status</TH>
                <TH>Reason</TH>
                <TH>Created</TH>
              </TR>
            </THead>
            <TBody>
              {items.map((d: any) => (
                <TR key={d.id}>
                  <TD>{d.id}</TD>
                  <TD>{d.invoiceId ?? d.invoice_id}</TD>
                  <TD>{d.status}</TD>
                  <TD>{d.reason ?? '-'}</TD>
                  <TD>{d.createdAt ?? d.created_at}</TD>
                </TR>
              ))}
              {items.length === 0 && (
                <TR><TD colSpan={5} className="text-muted">No disputes</TD></TR>
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
