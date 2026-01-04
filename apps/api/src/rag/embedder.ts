export interface TextEmbedder {
  dim: number;
  embed(text: string): Promise<number[]>;
}

export class DummyEmbedder implements TextEmbedder {
  dim: number;
  constructor(dim = 64) {
    this.dim = dim;
  }
  async embed(text: string): Promise<number[]> {
    const v = new Array(this.dim).fill(0);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const idx = code % this.dim;
      v[idx] += 1;
    }
    const norm = Math.sqrt(v.reduce((a, b) => a + b * b, 0)) || 1;
    return v.map((x) => x / norm);
  }
}
