import { CustomVoyageEmbeddings } from '../voyage-embeddings';

describe('CustomVoyageEmbeddings', () => {
  it('should throw if api key is missing', () => {
    expect(() => new CustomVoyageEmbeddings({ apiKey: '' } as any)).toThrow();
  });

  it('should call embed on client', async () => {
    const embeddings = new CustomVoyageEmbeddings({ apiKey: 'key' } as any);
    // @ts-expect-error - override private client for testing
    embeddings.client = {
      embed: jest.fn().mockResolvedValue({ data: [{ embedding: [1, 2] }] }),
    };
    const result = await embeddings.embedQuery('test');
    expect(result).toEqual([1, 2]);
  });
});
