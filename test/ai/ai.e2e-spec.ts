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

  it('should answer question', async () => {
    const result = await service.answerQuestion('Q?', 'ctx');
    expect(result).toEqual({ answer: 'ok', confidence: 1 });
  });
});
