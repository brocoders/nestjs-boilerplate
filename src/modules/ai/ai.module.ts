import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import configuration from '../../config/configuration';
import { LlmFactory } from '../analysis/llm/llm.factory';
import { GeminiLlm } from '../analysis/llm/gemini.llm';
import { OpenAiLlm } from '../analysis/llm/openai.llm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  providers: [AiService, LlmFactory, GeminiLlm, OpenAiLlm],
  exports: [AiService],
})
export class AiModule {}
