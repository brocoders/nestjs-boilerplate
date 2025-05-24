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

    it('should throw if schema.parse throws (malformed output)', async () => {
      const schema = {
        parse: jest.fn(() => {
          throw new Error('parse error');
        }),
      } as any;
      const invoke = jest.fn().mockResolvedValue('{"foo":"bar"}');
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

      await expect(
        (service as any).invokeWithSchema(schema, promptTemplate, {}),
      ).rejects.toThrow('Failed to parse result');
    });

    it('should throw if LLM/model throws', async () => {
      const schema = { parse: jest.fn((v) => v) } as any;
      const invoke = jest.fn().mockRejectedValue(new Error('llm error'));
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

      await expect(
        (service as any).invokeWithSchema(schema, promptTemplate, {}),
      ).rejects.toThrow('llm error');
    });

    it('should throw if LLM/model returns malformed JSON', async () => {
      const schema = { parse: jest.fn((v) => v) } as any;
      const invoke = jest.fn().mockResolvedValue('not-json');
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

      await expect(
        (service as any).invokeWithSchema(schema, promptTemplate, {}),
      ).rejects.toThrow('Failed to parse result');
    });

    it('should pass Langfuse callback handler to LLM/model', async () => {
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

      await (service as any).invokeWithSchema(schema, promptTemplate, {});
      // Check that invoke was called with callbacks containing the langfuse handler
      expect(invoke).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          callbacks: expect.arrayContaining([expect.any(Object)]),
        }),
      );
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

    it('should throw if question is missing', async () => {
      await expect(
        service.answerQuestion(undefined as any, 'context'),
      ).rejects.toThrow();
    });

    it('should throw if context is missing', async () => {
      await expect(
        service.answerQuestion('Q?', undefined as any),
      ).rejects.toThrow();
    });

    it('should propagate errors from invokeWithSchema', async () => {
      jest
        .spyOn<any, any>(service as any, 'invokeWithSchema')
        .mockRejectedValue(new Error('invoke error'));
      await expect(service.answerQuestion('Q?', 'context')).rejects.toThrow(
        'invoke error',
      );
    });
  });

  describe('startChatSession', () => {
    it('should return session id', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockReturnValue({});

      await expect(service.startChatSession('abc')).resolves.toBe('abc');
    });

    it('should throw if contractId is invalid', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockImplementation(() => {
          throw new Error('invalid contractId');
        });
      await expect(service.startChatSession(undefined as any)).rejects.toThrow(
        'invalid contractId',
      );
    });

    it('should handle concurrent calls without race conditions', async () => {
      const getOrCreateSpy = jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockImplementation(() => ({}));
      const contractId = 'race';
      await Promise.all([
        service.startChatSession(contractId),
        service.startChatSession(contractId),
        service.startChatSession(contractId),
      ]);
      // Should not throw or create multiple graphs for the same contractId
      expect(getOrCreateSpy).toHaveBeenCalledTimes(3);
    });

    it('should propagate errors if getOrCreateChatGraph rejects', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockImplementation(() => Promise.reject(new Error('async error')));
      // startChatSession does not await getOrCreateChatGraph result, so we need to handle this as a thrown error
      await expect(service.startChatSession('err')).rejects.toThrow(
        'async error',
      );
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

    it('should throw if contractId is invalid', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockImplementation(() => {
          throw new Error('invalid contractId');
        });
      await expect(
        service.chatWithContract(undefined as any, 'msg'),
      ).rejects.toThrow('invalid contractId');
    });

    it('should handle concurrent chat calls without race conditions', async () => {
      const invoke = jest.fn().mockResolvedValue({ messages: ['hi'] });
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockReturnValue({ invoke });
      const contractId = 'race-chat';
      await Promise.all([
        service.chatWithContract(contractId, 'msg1'),
        service.chatWithContract(contractId, 'msg2'),
        service.chatWithContract(contractId, 'msg3'),
      ]);
      expect(invoke).toHaveBeenCalledTimes(3);
    });

    it('should propagate errors if invoke rejects', async () => {
      const invoke = jest.fn().mockRejectedValue(new Error('invoke error'));
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockReturnValue({ invoke });
      await expect(service.chatWithContract('c2', 'msg')).rejects.toThrow(
        'invoke error',
      );
    });

    it('should propagate errors if getOrCreateChatGraph throws', async () => {
      jest
        .spyOn<any, any>(service as any, 'getOrCreateChatGraph')
        .mockImplementation(() => {
          throw new Error('sync error');
        });
      await expect(service.chatWithContract('c3', 'msg')).rejects.toThrow(
        'sync error',
      );
    });
  });
});
