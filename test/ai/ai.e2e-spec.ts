import { Test } from '@nestjs/testing';
import { LlmFactory } from '../../src/modules/analysis/llm/llm.factory';
import { ConfigService } from '@nestjs/config';

jest.mock('langfuse-langchain', () => ({
  CallbackHandler: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('langfuse', () => ({
  Langfuse: jest.fn().mockImplementation(() => ({
    getPrompt: jest.fn().mockResolvedValue({ prompt: '' }),
  })),
}));

import { AiService } from '../../src/modules/ai/ai.service';

describe('AiService E2E', () => {
  let service: AiService;

  beforeEach(async () => {
    const invoke = jest.fn().mockResolvedValue({ answer: 'ok', confidence: 1 });
    const mockLlm = {
      model: { withStructuredOutput: jest.fn(() => ({ invoke })) },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: LlmFactory, useValue: { getLlm: () => mockLlm } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(AiService);
  });

  describe('answerQuestion', () => {
    it('should answer question', async () => {
      const result = await service.answerQuestion('Q?', 'ctx');
      expect(result).toEqual({ answer: 'ok', confidence: 1 });
    });

    it('should throw for empty question', async () => {
      await expect(service.answerQuestion('', 'ctx')).rejects.toThrow();
    });

    it('should throw for empty context', async () => {
      await expect(service.answerQuestion('Q?', '')).rejects.toThrow();
    });

    it('should handle LLM failure', async () => {
      const invoke = jest.fn().mockRejectedValue(new Error('llm error'));
      const mockLlm = {
        model: { withStructuredOutput: jest.fn(() => ({ invoke })) },
      };
      const moduleRef = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: LlmFactory, useValue: { getLlm: () => mockLlm } },
          { provide: ConfigService, useValue: { get: jest.fn() } },
        ],
      }).compile();
      const failingService = moduleRef.get(AiService);
      await expect(failingService.answerQuestion('Q?', 'ctx')).rejects.toThrow(
        'llm error',
      );
    });

    it('should throw for malformed LLM output', async () => {
      const invoke = jest.fn().mockResolvedValue('not-json');
      const mockLlm = {
        model: { withStructuredOutput: jest.fn(() => ({ invoke })) },
      };
      const moduleRef = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: LlmFactory, useValue: { getLlm: () => mockLlm } },
          { provide: ConfigService, useValue: { get: jest.fn() } },
        ],
      }).compile();
      const malformedService = moduleRef.get(AiService);
      await expect(
        malformedService.answerQuestion('Q?', 'ctx'),
      ).rejects.toThrow();
    });
  });

  describe('analyzeContract', () => {
    it('should analyze contract and return expected structure', async () => {
      jest.spyOn(service['textSplitter'], 'createDocuments').mockResolvedValue([{ pageContent: 'chunk', metadata: {} }]);
      service['analyzeChunk'] = jest
        .fn()
        .mockResolvedValue({
          clauses: [{ text: 'c', type: 't' }],
          risks: [{ type: 'r', description: 'd', severity: 's' }],
        });
      service['generateSummary'] = jest.fn().mockResolvedValue({ summary: 's' });
      const result = await service.analyzeContract('contract', 'type');
      expect(result).toHaveProperty('clauses');
      expect(result).toHaveProperty('risks');
      expect(result).toHaveProperty('summary');
    });
    it('should handle empty contract text', async () => {
      jest.spyOn(service['textSplitter'], 'createDocuments').mockResolvedValue([]);
      service['analyzeChunk'] = jest.fn();
      service['generateSummary'] = jest.fn().mockResolvedValue({ summary: 's' });
      const result = await service.analyzeContract('', 'type');
      expect(result.clauses).toEqual([]);
      expect(result.risks).toEqual([]);
    });
    it('should handle analyzeChunk error', async () => {
      jest.spyOn(service['textSplitter'], 'createDocuments').mockResolvedValue([{ pageContent: 'chunk', metadata: {} }]);
      service['analyzeChunk'] = jest.fn().mockRejectedValue(new Error('fail'));
      service['generateSummary'] = jest.fn().mockResolvedValue({ summary: 's' });
      await expect(service.analyzeContract('contract', 'type')).rejects.toThrow(
        'fail',
      );
    });
  });

  describe('generateSummary', () => {
    it('should return summary for valid input', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockResolvedValue({ summary: 's' });
      const result = await service.generateSummary('text', 'type');
      expect(result).toHaveProperty('summary');
    });
    it('should handle empty text', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockResolvedValue({ summary: 's' });
      const result = await service.generateSummary('', 'type');
      expect(result).toHaveProperty('summary');
    });
    it('should handle invokeWithSchema error', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(service.generateSummary('text', 'type')).rejects.toThrow('fail');
    });
  });

  describe('compareWithTemplate', () => {
    it('should return differences, suggestions, riskLevel', async () => {
      service['invokeWithSchema'] = jest.fn().mockResolvedValue({
        differences: ['diff'],
        suggestedChanges: ['change'],
        riskLevel: 'LOW',
      });
      const result = await service.compareWithTemplate('clause', 'template');
      expect(result).toHaveProperty('differences');
      expect(result).toHaveProperty('suggestedChanges');
      expect(result).toHaveProperty('riskLevel');
    });
    it('should handle empty clause/template', async () => {
      service['invokeWithSchema'] = jest.fn().mockResolvedValue({
        differences: [],
        suggestedChanges: [],
        riskLevel: 'LOW',
      });
      const result = await service.compareWithTemplate('', '');
      expect(result).toHaveProperty('differences');
    });
    it('should handle invokeWithSchema error', async () => {
      service['invokeWithSchema'] = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(service.compareWithTemplate('c', 't')).rejects.toThrow('fail');
    });
  });

  describe('extractClauses', () => {
    it('should return array of clauses', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockResolvedValue([{ title: 't', clauseType: 'ct', text: 'txt', riskScore: 'Low', riskJustification: 'rj' }]);
      const result = await service.extractClauses('text', 'type');
      expect(Array.isArray(result)).toBe(true);
    });
    it('should handle empty text/contractType', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockResolvedValue([]);
      const result = await service.extractClauses('', '');
      expect(Array.isArray(result)).toBe(true);
    });
    it('should handle invokeWithSchema error', async () => {
      jest.spyOn(service['langfuse'], 'getPrompt').mockResolvedValue({ prompt: '' });
      service['invokeWithSchema'] = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(service.extractClauses('t', 't')).rejects.toThrow('fail');
    });
  });

  describe('splitIntoClauses', () => {
    it('should split text into clauses using LLM', async () => {
      jest.spyOn(service['llmFactory'], 'getLlm').mockReturnValue({ invoke: jest.fn().mockResolvedValue('["a","b"]') } as any);
      const result = await service.splitIntoClauses('text');
      expect(result).toEqual(['a', 'b']);
    });
    it('should fallback to textSplitter if LLM fails', async () => {
      jest.spyOn(service['llmFactory'], 'getLlm').mockReturnValue({ invoke: jest.fn().mockRejectedValue(new Error('fail')) } as any);
      jest.spyOn(service['textSplitter'], 'splitText').mockReturnValue(Promise.resolve(['fallback']));
      const result = await service.splitIntoClauses('text');
      expect(result).toEqual(['fallback']);
    });
  });

  describe('analyzeClause', () => {
    it('should return type and risks for valid clause', async () => {
      jest.spyOn(service['llmFactory'], 'getLlm').mockReturnValue({ invoke: jest.fn().mockResolvedValue('{"type":"Termination","risks":[]}') } as any);
      const result = await service.analyzeClause('clause');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('risks');
    });
    it('should fallback to default if LLM fails', async () => {
      jest.spyOn(service['llmFactory'], 'getLlm').mockReturnValue({ invoke: jest.fn().mockRejectedValue(new Error('fail')) } as any);
      const result = await service.analyzeClause('clause');
      expect(result).toEqual({ type: 'Unknown', risks: [] });
    });
  });
});
