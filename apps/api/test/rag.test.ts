import { buildIndex, search, split } from '../src/rag/pipeline';

test('search retrieves relevant chunk', async () => {
  const text =
    'alpha beta gamma. invoice dispute resolution alpha. vendor contract terms beta gamma delta.';
  const chunks = split(text, 40);
  const index = await buildIndex(chunks);
  const res = await search(index, 'alpha dispute', 1);
  expect(res[0].id).toBe(chunks[0].id);
});
