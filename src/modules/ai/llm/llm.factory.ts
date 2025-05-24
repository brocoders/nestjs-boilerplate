import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiLlm } from './gemini.llm';
import { OpenAiLlm } from './openai.llm';
import { Llm } from './llm.interface';

@Injectable()
export class LlmFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly geminiLlm: GeminiLlm,
    private readonly openAiLlm: OpenAiLlm,
  ) {}

  getLlm(): Llm {
    const provider = this.configService.get<string>('ai.provider', {
      infer: true,
    });
    if (provider === 'openai') {
      return this.openAiLlm;
    }
    return this.geminiLlm;
  }
}
