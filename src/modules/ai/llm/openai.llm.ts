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

  async *streamInvoke(
    input: string | Record<string, unknown>,
  ): AsyncIterable<string> {
    const stream = await this.model.stream(input as string);
    for await (const chunk of stream) {
      if (Array.isArray(chunk.content)) {
        const text = chunk.content
          .map((part) => {
            if (typeof part === 'string') return part;
            if (
              typeof part === 'object' &&
              part &&
              'text' in part &&
              typeof part.text === 'string'
            ) {
              return part.text;
            }
            return '';
          })
          .join('');
        if (text) yield text;
      } else if (typeof chunk.content === 'string') {
        yield chunk.content;
      }
    }
  }
}
