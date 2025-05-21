import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LlmFactory } from '../analysis/llm/llm.factory';
import { Llm } from '../analysis/llm/llm.interface';
import { z } from 'zod';
import { zodSchemaToPromptDescription } from '../../utils/zod-schema-to-prompt';
import { CallbackHandler } from 'langfuse-langchain';
import { ContractSummarySchema } from './schema/summary.schema';
import { Langfuse } from 'langfuse';
import { AnalysisSchema } from './schema/analysis.schema';

@Injectable()
export class AiService {
  private readonly llm: Llm;
  private readonly textSplitter: RecursiveCharacterTextSplitter;
  private readonly langfuseHandler!: CallbackHandler;
  private readonly langfuse: Langfuse;

  constructor(
    private readonly llmFactory: LlmFactory,
    private readonly configService: ConfigService,
  ) {
    this.llm = this.llmFactory.getLlm();
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', ' ', ''],
    });
    // Initialize Langfuse callback handler
    this.langfuseHandler = new CallbackHandler({
      publicKey: this.configService.get<string>('langfuse.publicKey', {
        infer: true,
      }),
      secretKey: this.configService.get<string>('langfuse.secretKey', {
        infer: true,
      }),
      baseUrl: this.configService.get<string>('langfuse.baseUrl', {
        infer: true,
      }),
    });
    this.langfuse = new Langfuse({
      publicKey: this.configService.get<string>('langfuse.publicKey', {
        infer: true,
      }),
      secretKey: this.configService.get<string>('langfuse.secretKey', {
        infer: true,
      }),
      baseUrl: this.configService.get<string>('langfuse.baseUrl', {
        infer: true,
      }),
    });
  }

  private async invokeWithSchema<T>(
    schema: z.ZodType<T>,
    prompt: PromptTemplate | string,
    inputVars: Record<string, any>,
    options?: { skipSchemaDescription?: boolean },
  ): Promise<T> {
    let result: any;
    const schemaDescription = options?.skipSchemaDescription
      ? undefined
      : zodSchemaToPromptDescription(schema);
    const promptTemplate =
      typeof prompt === 'string' ? PromptTemplate.fromTemplate(prompt) : prompt;
    if (typeof (this.llm as any).model?.withStructuredOutput === 'function') {
      const modelWithSchema = (this.llm as any).model.withStructuredOutput(
        schema,
      );
      result = await modelWithSchema.invoke(
        promptTemplate,
        { ...inputVars, ...(schemaDescription ? { schemaDescription } : {}) },
        { callbacks: [this.langfuseHandler] },
      );
    } else {
      const chain = promptTemplate
        .pipe((this.llm as any).model)
        .pipe(new StringOutputParser());

      const raw = await chain.invoke(
        { ...inputVars, ...(schemaDescription ? { schemaDescription } : {}) },
        { callbacks: [this.langfuseHandler] },
      );
      try {
        result = schema.parse(JSON.parse(raw));
      } catch (e) {
        throw new Error('Failed to parse result: ' + e);
      }
    }
    return result;
  }

  async analyzeContract(
    text: string,
    contractType: string,
  ): Promise<{
    clauses: { text: string; type: string }[];
    risks: { type: string; description: string; severity: string }[];
    summary: z.infer<typeof ContractSummarySchema>;
  }> {
    // Split the contract into chunks
    const docs = await this.textSplitter.createDocuments([text]);

    // Analyze each chunk for clauses and risks
    const analysisResults = await Promise.all(
      docs.map((doc) => this.analyzeChunk(doc, contractType)),
    );

    // Combine results
    const clauses = analysisResults.flatMap((result) => result.clauses);
    const risks = analysisResults.flatMap((result) => result.risks);

    // Generate overall summary
    const summary = await this.generateSummary(text, contractType);

    return {
      clauses,
      risks,
      summary,
    };
  }

  private async analyzeChunk(
    doc: Document,
    contractType: string,
  ): Promise<{
    clauses: { text: string; type: string }[];
    risks: { type: string; description: string; severity: string }[];
  }> {
    const contractAnalysisPrompt = await this.langfuse.getPrompt(
      'contract-analysis-prompt',
    );
    const prompt = PromptTemplate.fromTemplate(contractAnalysisPrompt.prompt);
    const result = await this.invokeWithSchema<z.infer<typeof AnalysisSchema>>(
      AnalysisSchema,
      prompt,
      {
        contractType,
        text: doc.pageContent,
      },
    );
    return result;
  }

  private async generateSummary(
    text: string,
    contractType: string,
  ): Promise<z.infer<typeof ContractSummarySchema>> {
    const prompt = (await this.langfuse.getPrompt('contract-summary')).prompt;
    return this.invokeWithSchema<z.infer<typeof ContractSummarySchema>>(
      ContractSummarySchema,
      prompt,
      {
        text,
        contractType,
      },
    );
  }

  async answerQuestion(
    question: string,
    context: string,
  ): Promise<{ answer: string; confidence: number }> {
    const AnswerSchema = z.object({
      answer: z.string().describe("The answer to the user's question"),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score between 0 and 1'),
    });
    const prompt = PromptTemplate.fromTemplate(`
      Answer the following question based on the provided contract context.
      If you cannot find a definitive answer in the context, say so.

      Context: {context}
      Question: {question}

      Provide your answer in JSON format with the following schema:
      ${zodSchemaToPromptDescription(AnswerSchema)}
    `);
    return this.invokeWithSchema<z.infer<typeof AnswerSchema>>(
      AnswerSchema,
      prompt,
      { context, question },
    );
  }

  async compareWithTemplate(
    clauseText: string,
    templateText: string,
  ): Promise<{
    differences: string[];
    suggestedChanges: string[];
    riskLevel: string;
  }> {
    const CompareSchema = z.object({
      differences: z
        .array(
          z
            .string()
            .describe('A key difference between the clause and the template'),
        )
        .describe('List of key differences'),
      suggestedChanges: z
        .array(
          z.string().describe('A suggested change to align with the template'),
        )
        .describe('List of suggestions'),
      riskLevel: z
        .enum(['LOW', 'MEDIUM', 'HIGH'])
        .describe('Overall risk level'),
    });
    const prompt = PromptTemplate.fromTemplate(`
      Compare the following clause with the template clause and identify:
      1. Key differences
      2. Suggested changes to align with the template
      3. Overall risk level (LOW/MEDIUM/HIGH)

      Clause Text: {clauseText}
      Template Text: {templateText}

      Provide the analysis in JSON format with the following schema:
      ${zodSchemaToPromptDescription(CompareSchema)}
    `);
    return this.invokeWithSchema<z.infer<typeof CompareSchema>>(
      CompareSchema,
      prompt,
      { clauseText, templateText },
    );
  }

  async extractClauses(text: string, contractType: string) {
    const ClauseSchema = z.object({
      title: z.string(),
      clauseType: z.string(),
      text: z.string(),
      riskScore: z.enum(['Low', 'Medium', 'High']),
      riskJustification: z.string(),
      entities: z.array(z.string()).optional(),
      amounts: z.array(z.string()).optional(),
      dates: z.array(z.string()).optional(),
      legalReferences: z.array(z.string()).optional(),
    });
    const prompt = (await this.langfuse.getPrompt('extract-clause')).prompt;
    return this.invokeWithSchema<z.infer<typeof ClauseSchema>[]>(
      z.array(ClauseSchema),
      prompt,
      { text, contractType },
    );
  }
}
