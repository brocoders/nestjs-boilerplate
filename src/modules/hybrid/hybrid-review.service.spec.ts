import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HybridReviewService } from './hybrid-review.service';
import { AiService } from '../ai/ai.service';
import scribe from 'scribe.js-ocr';

jest.mock('langfuse-langchain', () => ({
  CallbackHandler: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('langfuse', () => ({
  Langfuse: jest.fn().mockImplementation(() => ({
    getPrompt: jest.fn().mockResolvedValue({ prompt: '' }),
  })),
}));

jest.mock('scribe.js-ocr', () => ({
  extractText: jest.fn(),
}));

describe('HybridReviewService', () => {
  let service: HybridReviewService;
  let aiService: { extractClauses: jest.Mock };
  let configService: { get: jest.Mock };
  let session: any;
  let driver: any;
  let milvusClient: any;
  let vectorStore: any;

  beforeEach(async () => {
    aiService = { extractClauses: jest.fn() } as any;
    configService = { get: jest.fn() } as any;

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HybridReviewService,
        { provide: AiService, useValue: aiService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = moduleRef.get(HybridReviewService);

    session = { run: jest.fn(), close: jest.fn() };
    driver = { session: jest.fn(() => session) };
    milvusClient = {
      hasCollection: jest.fn().mockResolvedValue(true),
      createCollection: jest.fn(),
      loadCollectionSync: jest.fn(),
      closeConnection: jest.fn(),
      config: {},
    };
    vectorStore = {
      addDocuments: jest.fn(),
      similaritySearch: jest.fn(),
    };

    (service as any).driver = driver;
    (service as any).milvusClient = milvusClient;
    (service as any).vectorStore = vectorStore;
  });

  afterEach(() => jest.clearAllMocks());

  describe('extractText', () => {
    it('should join extracted text', async () => {
      (scribe.extractText as jest.Mock).mockResolvedValue(['a', 'b']);
      const result = await service.extractText(['src']);
      expect(scribe.extractText).toHaveBeenCalledWith(['src']);
      expect(result).toBe('a\nb');
    });
  });

  describe('extractClauses', () => {
    it('should parse aiService output', async () => {
      const clauses = [
        {
          title: 'T',
          clauseType: 'Type',
          text: 'text',
          riskScore: 'Low',
          riskJustification: 'j',
        },
      ];
      aiService.extractClauses.mockResolvedValue(clauses);
      const result = await service.extractClauses('t', 'NDA');
      expect(aiService.extractClauses).toHaveBeenCalledWith('t', 'NDA');
      expect(result).toEqual(clauses);
    });
  });

  describe('saveContract', () => {
    it('should store clauses and embeddings', async () => {
      const storeSpy = jest
        .spyOn<any, any>(service as any, 'storeEmbedding')
        .mockResolvedValue(undefined);
      const clauses = [
        { title: 't', clauseType: 'c', text: 'txt', riskScore: 'Low' },
      ];
      await service.saveContract('1', 'Title', clauses as any);

      expect(driver.session).toHaveBeenCalled();
      expect(session.run).toHaveBeenCalledWith(
        'MERGE (c:Contract {id: $id, title: $title})',
        { id: '1', title: 'Title' },
      );
      expect(session.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (c:Contract'),
        expect.objectContaining({
          cid: '1',
          title: 't',
          type: 'c',
          text: 'txt',
          risk: 'Low',
        }),
      );
      expect(storeSpy).toHaveBeenCalledWith(expect.any(String), 'txt');
      expect(session.close).toHaveBeenCalled();
    });
  });

  describe('searchClauses', () => {
    it('should search and return clauses', async () => {
      vectorStore.similaritySearch.mockResolvedValue([
        { metadata: { id: 'c1' } },
      ]);
      session.run.mockResolvedValue({
        records: [{ get: () => ({ properties: { id: 'c1', title: 'T' } }) }],
      });

      const result = await service.searchClauses('q', 2);

      expect(vectorStore.similaritySearch).toHaveBeenCalledWith('q', 2);
      expect(session.run).toHaveBeenCalledWith(
        'MATCH (c:Clause) WHERE c.id IN $ids RETURN c',
        { ids: ['c1'] },
      );
      expect(result).toEqual([{ id: 'c1', title: 'T' }]);
      expect(session.close).toHaveBeenCalled();
    });
  });
});
