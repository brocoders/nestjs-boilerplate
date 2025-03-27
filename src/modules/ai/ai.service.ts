import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class AiService {
  private openai: ChatOpenAI;
  private gemini: GoogleGenerativeAI;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor(private configService: ConfigService) {
    // Initialize OpenAI
    this.openai = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('ai.openai.apiKey') || '',
      modelName: this.configService.get<string>('ai.openai.model') || 'gpt-4',
      temperature: 0.1,
    });

    // Initialize Gemini
    this.gemini = new GoogleGenerativeAI(
      this.configService.get<string>('ai.gemini.apiKey') || '',
    );

    // Initialize text splitter
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', ' ', ''],
    });
  }

  async analyzeContract(text: string, contractType: string): Promise<{
    clauses: { text: string; type: string }[];
    risks: { type: string; description: string; severity: string }[];
    summary: string;
  }> {
    // Split the contract into chunks
    const docs = await this.textSplitter.createDocuments([text]);

    // Analyze each chunk for clauses and risks
    const analysisResults = await Promise.all(
      docs.map((doc) => this.analyzeChunk(doc, contractType))
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
    const prompt = PromptTemplate.fromTemplate(`
      Analyze the following contract section and identify:
      1. Individual clauses and their types
      2. Potential risks and their severity

      Contract Type: {contractType}
      Section: {text}

      Provide the analysis in JSON format with the following structure:
      {
        "clauses": [
          { "text": "clause text", "type": "clause type" }
        ],
        "risks": [
          { "type": "risk type", "description": "risk description", "severity": "LOW/MEDIUM/HIGH" }
        ]
      }
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.openai,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      contractType,
      text: doc.pageContent,
    });

    return JSON.parse(result);
  }

  private async generateSummary(
    text: string,
    contractType: string,
  ): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
      Generate a comprehensive summary of the following contract.

      Contract Type: {contractType}
      Contract Text: {text}

      Include:
      1. Key parties involved
      2. Main terms and conditions
      3. Important dates and deadlines
      4. Financial terms
      5. Key obligations
      6. Termination conditions
      7. Any unusual or noteworthy terms

      Format the summary in a clear, structured manner.
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.openai,
      new StringOutputParser(),
    ]);

    return await chain.invoke({
      contractType,
      text,
    });
  }

  async answerQuestion(
    question: string,
    context: string,
  ): Promise<{ answer: string; confidence: number }> {
    const prompt = PromptTemplate.fromTemplate(`
      Answer the following question based on the provided contract context.
      If you cannot find a definitive answer in the context, say so.

      Context: {context}
      Question: {question}

      Provide your answer in JSON format:
      {
        "answer": "your answer here",
        "confidence": number between 0 and 1
      }
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.openai,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      context,
      question,
    });

    return JSON.parse(result);
  }

  async compareWithTemplate(
    clauseText: string,
    templateText: string,
  ): Promise<{
    differences: string[];
    suggestedChanges: string[];
    riskLevel: string;
  }> {
    const prompt = PromptTemplate.fromTemplate(`
      Compare the following clause with the template clause and identify:
      1. Key differences
      2. Suggested changes to align with the template
      3. Overall risk level (LOW/MEDIUM/HIGH)

      Clause Text: {clauseText}
      Template Text: {templateText}

      Provide the analysis in JSON format:
      {
        "differences": ["difference 1", "difference 2"],
        "suggestedChanges": ["suggestion 1", "suggestion 2"],
        "riskLevel": "LOW/MEDIUM/HIGH"
      }
    `);

    const chain = RunnableSequence.from([
      prompt,
      this.openai,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      clauseText,
      templateText,
    });

    return JSON.parse(result);
  }
} 