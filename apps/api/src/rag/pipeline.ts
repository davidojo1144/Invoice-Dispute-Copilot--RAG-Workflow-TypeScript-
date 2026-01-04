import { DummyEmbedder, TextEmbedder } from './embedder.js';
import { cosine } from './similarity.js';

export type DocChunk = {
  id: string;
  content: string;
  embedding?: number[];
};

export function split(text: string, maxLen = 256): DocChunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: DocChunk[] = [];
  let buf: string[] = [];
  let idx = 0;
  for (const w of words) {
    buf.push(w);
    if (buf.join(' ').length >= maxLen) {
      chunks.push({ id: `c${idx++}`, content: buf.join(' ') });
      buf = [];
    }
  }
  if (buf.length) chunks.push({ id: `c${idx++}`, content: buf.join(' ') });
  return chunks;
}

export async function buildIndex(chunks: DocChunk[], embedder: TextEmbedder = new DummyEmbedder()) {
  const out: DocChunk[] = [];
  for (const c of chunks) {
    const e = await embedder.embed(c.content);
    out.push({ ...c, embedding: e });
  }
  return out;
}

export async function search(
  index: DocChunk[],
  query: string,
  k = 3,
  embedder: TextEmbedder = new DummyEmbedder()
) {
  const q = await embedder.embed(query);
  const scored = index.map((c) => ({ id: c.id, score: cosine(q, c.embedding ?? []) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
