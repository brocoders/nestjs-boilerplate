import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { Llm } from './llm.interface';

@Injectable()
export class OpenAiLlm implements Llm {
  private readonly model: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    this.model = new ChatOpenAI({
      openAIApiKey:
        this.configService.get<string>('ai.openai.apiKey', { infer: true }) ||
        '',
      modelName:
        this.configService.get<string>('ai.openai.model', { infer: true }) ||
        'gpt-4',
    });
  }

  async invoke(input: string | Record<string, unknown>): Promise<string> {
    const result = await this.model.invoke(input as string);
    // @ts-expect-error LangChain types return AIMessage
    return result.content || '';
  }
}
