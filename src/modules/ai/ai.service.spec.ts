import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LlmFactory } from './llm/llm.factory';

jest.mock('langfuse-langchain', () => ({
  CallbackHandler: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('langfuse', () => ({
  Langfuse: jest.fn().mockImplementation(() => ({
    getPrompt: jest.fn().mockResolvedValue({ prompt: '' }),
  })),
}));

import { AiService } from './ai.service';
import { PromptTemplate } from '@langchain/core/prompts';

describe('AiService', () => {
  let service: AiService;
  let llmFactory: { getLlm: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    llmFactory = { getLlm: jest.fn() };
    configService = { get: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: LlmFactory, useValue: llmFactory },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(AiService);
  });

  describe('invokeWithSchema', () => {
    it('should use structured output when supported', async () => {
      const schema = { parse: jest.fn() } as any;
      const expected = { foo: 'bar' };
      const invoke = jest.fn().mockResolvedValue(expected);
      const model = { withStructuredOutput: jest.fn(() => ({ invoke })) };
      llmFactory.getLlm.mockReturnValue({ model });

      // Recreate service to apply mock llm
      const module = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: LlmFactory, useValue: llmFactory },
          { provide: ConfigService, useValue: configService },
        ],
      }).compile();
      service = module.get(AiService);

      const prompt = new PromptTemplate({
        template: 'test',
        inputVariables: [],
      });
      const result = await (service as any).invokeWithSchema(
        schema,
        prompt,
        {},
      );

      expect(model.withStructuredOutput).toHaveBeenCalledWith(schema);
      expect(invoke).toHaveBeenCalled();
      expect(result).toBe(expected);
    });

    it('should parse raw output when structured output not supported', async () => {
      const schema = { parse: jest.fn((v) => v) } as any;
      const expected = { foo: 'bar' };
      const invoke = jest.fn().mockResolvedValue(JSON.stringify(expected));
      const chain = { invoke };
      const intermediate = { pipe: jest.fn(() => chain) };
      const promptTemplate = { pipe: jest.fn(() => intermediate) } as any;
      const model = {};
      llmFactory.getLlm.mockReturnValue({ model });

      const module = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: LlmFactory, useValue: llmFactory },
          { provide: ConfigService, useValue: configService },
        ],
      }).compile();
      service = module.get(AiService);

      const result = await (service as any).invokeWithSchema(
        schema,
        promptTemplate,
        {},
      );
      expect(promptTemplate.pipe).toHaveBeenCalledWith(model);
      expect(schema.parse).toHaveBeenCalledWith(expected);
      expect(result).toEqual(expected);
    });
  });

  describe('answerQuestion', () => {
    it('should call invokeWithSchema with correct params', async () => {
      const invokeSpy = jest
        .spyOn<any, any>(service as any, 'invokeWithSchema')
        .mockResolvedValue({ answer: '42', confidence: 1 });

      const result = await service.answerQuestion('Q?', 'context');

      expect(invokeSpy).toHaveBeenCalled();
      expect(result).toEqual({ answer: '42', confidence: 1 });
    });
  });

  describe('startChatSession', () => {
    it('should return session id', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockReturnValue({});

      await expect(service.startChatSession('abc')).resolves.toBe('abc');
    });
  });

  describe('chatWithContract', () => {
    it('should invoke chat graph and return messages', async () => {
      const invoke = jest.fn().mockResolvedValue({ messages: ['hi'] });
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockReturnValue({ invoke });

      const result = await service.chatWithContract('c1', 'hello');
      expect(invoke).toHaveBeenCalled();
      expect(result).toEqual(['hi']);
    });
  });
});
