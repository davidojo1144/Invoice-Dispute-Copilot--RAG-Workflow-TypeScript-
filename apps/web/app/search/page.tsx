'use client';

import { useState } from 'react';

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
    <section>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2>Search</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter query..." />
        &nbsp;&nbsp;
        <button className="btn" onClick={run}>Search</button>
      </div>
      <div className="card">
        <h2>Results</h2>
        {results.length === 0 && <p className="muted">No results</p>}
        {results.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Doc</th><th>Source</th><th>Snippet</th><th>Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.doc_id}</td>
                  <td>{r.source}</td>
                  <td>{r.snippet}</td>
                  <td>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
