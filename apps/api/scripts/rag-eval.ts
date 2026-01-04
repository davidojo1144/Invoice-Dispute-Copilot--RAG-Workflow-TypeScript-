import { buildIndex, search, split } from '../src/rag/pipeline';

async function run() {
  const corpus = [
    { id: 'd1', text: 'Alpha dispute regarding invoice 123 for vendor X.' },
    { id: 'd2', text: 'Payment terms in the contract specify net 30 days.' },
    { id: 'd3', text: 'Gamma clause states dispute resolution via arbitration.' }
  ];
  const queries = [
    { q: 'alpha dispute invoice', relevant: 'd1' },
    { q: 'contract payment terms', relevant: 'd2' },
    { q: 'arbitration clause', relevant: 'd3' }
  ];
  const chunks = corpus.flatMap((d) => split(d.text, 64).map((c) => ({ ...c, id: `${d.id}:${c.id}` })));
  const index = await buildIndex(chunks);
  let correct = 0;
  for (const { q, relevant } of queries) {
    const res = await search(index, q, 3);
    const topId = res[0].id.split(':')[0];
    if (topId === relevant) correct++;
  }
  const accuracy = correct / queries.length;
  console.log(JSON.stringify({ accuracy }, null, 2));
}

run();
