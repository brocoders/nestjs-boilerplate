import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class AiService implements OnModuleInit {
  private geminiModel: any;
  private openaiModel: ChatOpenAI;
  private readonly textSplitter: RecursiveCharacterTextSplitter;

  constructor(private readonly configService: ConfigService) {
    // Initialize text splitter
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '.', '!', '?', ';', ':', ' ', ''],
    });
  }

  onModuleInit() {
    const geminiApiKey = this.configService.get<string>('GEMINI_API_KEY', {
      infer: true,
    });
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY', {
      infer: true,
    });

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Initialize OpenAI
    this.openaiModel = new ChatOpenAI({
      openAIApiKey: openaiApiKey,
      modelName: 'gpt-4-turbo-preview',
    });
  }

  async splitIntoClauses(text: string): Promise<string[]> {
    const prompt = PromptTemplate.fromTemplate(`
      Split the following contract text into individual clauses.
      Each clause should be a complete, self-contained unit of the contract.
      Return the clauses as a JSON array of strings.
      
      Contract text:
      {text}
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.geminiModel,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      text,
    });

    try {
      return JSON.parse(result);
    } catch {
      // Fallback to basic splitting if AI fails
      return this.textSplitter.splitText(text);
    }
  }

  async analyzeClause(clause: string): Promise<{
    type: string;
    risks: Array<{
      type: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH';
      description: string;
      suggestedResolution: string;
    }>;
  }> {
    const prompt = PromptTemplate.fromTemplate(`
      Analyze the following contract clause and identify:
      1. The type of clause (e.g., "Termination", "Confidentiality", "Indemnification")
      2. Any potential risks or issues, including:
         - Type of risk
         - Severity (LOW, MEDIUM, or HIGH)
         - Description of the risk
         - Suggested resolution
      
      Return the analysis as a JSON object with the following structure:
      {
        "type": "string",
        "risks": [
          {
            "type": "string",
            "severity": "LOW" | "MEDIUM" | "HIGH",
            "description": "string",
            "suggestedResolution": "string"
          }
        ]
      }
      
      Clause:
      {clause}
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.geminiModel,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      clause,
    });

    try {
      return JSON.parse(result);
    } catch {
      return {
        type: 'Unknown',
        risks: [],
      };
    }
  }

  async generateSummary(text: string, type: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
      Generate a {type} summary of the following contract text.
      The summary should be clear, concise, and highlight the key points.
      
      Type: {type}
      Text: {text}
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.geminiModel,
      new StringOutputParser(),
    ]);

    return chain.invoke({
      type,
      text,
    });
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
      Answer the following question about the contract text.
      Use only the information provided in the context.
      If the answer cannot be determined from the context, say so.
      
      Context: {context}
      Question: {question}
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.geminiModel,
      new StringOutputParser(),
    ]);

    return chain.invoke({
      context,
      question,
    });
  }

  async compareWithTemplate(
    clause: string,
    template: string,
  ): Promise<{
    isCompliant: boolean;
    deviations: Array<{
      type: string;
      description: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
  }> {
    const prompt = PromptTemplate.fromTemplate(`
      Compare the following clause with the template clause.
      Identify any deviations and assess their severity.
      
      Return the analysis as a JSON object with the following structure:
      {
        "isCompliant": boolean,
        "deviations": [
          {
            "type": "string",
            "description": "string",
            "severity": "LOW" | "MEDIUM" | "HIGH"
          }
        ]
      }
      
      Clause: {clause}
      Template: {template}
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.geminiModel,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      clause,
      template,
    });

    try {
      return JSON.parse(result);
    } catch {
      return {
        isCompliant: false,
        deviations: [],
      };
    }
  }
}
