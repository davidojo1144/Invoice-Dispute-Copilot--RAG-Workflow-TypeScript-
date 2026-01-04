'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

export default function Page() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  async function run() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/search?query=${encodeURIComponent(query)}`);
    const json = await res.json();
    setResults(json.hits ?? []);
  }
  return (
    <section className="space-y-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input className="flex-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter query..." />
            <Button onClick={run}>Search</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              {results.length === 0 && <p className="text-muted">No results</p>}
              {results.length > 0 && (
                <Table>
                  <THead>
                    <TR>
                      <TH>Doc</TH><TH>Source</TH><TH>Snippet</TH><TH>Score</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {results.map((r, i) => (
                      <TR key={i}>
                        <TD>{r.doc_id}</TD>
                        <TD>{r.source}</TD>
                        <TD>{r.snippet}</TD>
                        <TD>{r.score}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="json">
              <pre className="text-xs overflow-auto">{JSON.stringify(results, null, 2)}</pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
