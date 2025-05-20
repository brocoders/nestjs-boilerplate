import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Llm } from './llm.interface';

@Injectable()
export class GeminiLlm implements Llm {
  private readonly model: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey:
        this.configService.get<string>('ai.gemini.apiKey', { infer: true }) ||
        '',
      model:
        this.configService.get<string>('ai.gemini.model', { infer: true }) ||
        'gemini-pro',
    });
  }

  async invoke(input: string | Record<string, unknown>): Promise<string> {
    const result = await this.model.invoke(input as string);
    // @ts-expect-error LangChain types return AIMessage
    return result.content || '';
  }
}
