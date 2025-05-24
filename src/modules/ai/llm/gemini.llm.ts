import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Llm } from './llm.interface';

@Injectable()
export class GeminiLlm implements Llm {
  private readonly model: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY', {
      infer: true,
    });

    if (!apiKey) {
      throw new Error('Gemini API key (GEMINI_API_KEY) is not set');
    }
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model:
        this.configService.get<string>('GEMINI_MODEL', { infer: true }) ||
        'gemini-2.0-flash',
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
      // chunk.content can be a string or an array (for multimodal/tool-calling)
      if (Array.isArray(chunk.content)) {
        // Join only the string parts or objects with a 'text' property (ignore images/tool calls)
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
