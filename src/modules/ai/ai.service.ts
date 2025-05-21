import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LlmFactory } from '../analysis/llm/llm.factory';
import { Llm } from '../analysis/llm/llm.interface';
import { z } from 'zod';
import { zodSchemaToPromptDescription } from '../../utils/zod-schema-to-prompt';
import { CallbackHandler } from 'langfuse-langchain';
import { ContractSummarySchema } from './schema/summary.schema';

@Injectable()
export class AiService {
  private readonly llm: Llm;
  private readonly textSplitter: RecursiveCharacterTextSplitter;
  private readonly langfuseHandler!: CallbackHandler;

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
    // ---------------------------------------------------------------------------
    // 1.  STRONGER, SELF-DESCRIBING SCHEMA
    // ---------------------------------------------------------------------------

    /**
     * Enumerations are deliberately short and upper-case to avoid model drift.
     * Add new literals only through controlled code changes — never ad-hoc
     * inside the prompt.
     */
    const ClauseTypeEnum = z.enum([
      'TERM', // governing term / duration
      'TERMINATION', // rights to exit
      'PAYMENT', // commercial payment terms
      'IP', // intellectual-property
      'CONFIDENTIALITY',
      'INDEMNITY',
      'LIMITATION_OF_LIABILITY',
      'GOVERNING_LAW',
      'OTHER', // fall-back
    ]);

    const ObligationEnum = z.enum([
      'RIGHT',
      'OBLIGATION',
      'CONDITION',
      'REPRESENTATION',
    ]);

    const RiskTypeEnum = z.enum([
      'COMPLIANCE',
      'FINANCIAL',
      'LEGAL',
      'OPERATIONAL',
      'REPUTATIONAL',
      'OTHER',
    ]);

    const SeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

    const ClauseSchema = z.object({
      id: z
        .number()
        .int()
        .describe('Running index starting at 1, unique within the section'),
      text: z.string().describe('Verbatim clause text (trimmed)'),
      type: ClauseTypeEnum.describe('Normalized clause category'),
      obligation: ObligationEnum.describe(
        "Nature of the clause from the party's perspective",
      ),
      startIndex: z
        .number()
        .int()
        .describe('0-based character index of clause start within the section'),
      endIndex: z
        .number()
        .int()
        .describe(
          '0-based character index of clause end within the section, inclusive',
        ),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe(
          'Model confidence that the text is correctly classified (0-1)',
        ),
    });

    const RiskSchema = z.object({
      id: z
        .number()
        .int()
        .describe('Running index starting at 1, unique within the section'),
      clauseId: z
        .number()
        .int()
        .describe(
          'ID of the clause this risk relates to (or 0 if section-level)',
        ),
      type: RiskTypeEnum.describe('Normalized risk bucket'),
      description: z
        .string()
        .describe('Human-readable explanation of the risk'),
      severity: SeverityEnum.describe('Impact × likelihood'),
      mitigation: z
        .string()
        .describe(
          'Concise, actionable mitigation recommendation (<=120 chars)',
        ),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe(
          'Model confidence that the risk is correctly identified (0-1)',
        ),
    });

    const AnalysisSchema = z.object({
      sectionTitle: z
        .string()
        .describe(
          'Heading of the section being analysed, if identifiable, else ""',
        ),
      clauses: z.array(ClauseSchema).describe('All clauses in reading order'),
      risks: z.array(RiskSchema).describe('All risks (may reference clauses)'),
    });

    // ---------------------------------------------------------------------------
    // 2.  PROMPT THAT LOCKS THE MODEL INTO THE STRUCTURE
    // ---------------------------------------------------------------------------

    const schemaDescription = zodSchemaToPromptDescription(AnalysisSchema);

    /**
     *  Mini-playbook distilled from contract-drafting treatises + Big-Law
     *  review checklists.  The bullets are intentionally terse so they fit
     *  comfortably inside the model's context window without drowning the
     *  operative instructions.
     */
    const LEGAL_PLAYBOOK = `
      LEGAL LENS – HOW TO READ A CONTRACT SECTION
      • Identify the parties + role: seller/buyer, licensor/licensee, etc.
      • Parse defined terms (uppercase terms → check their definitions).
      • Ask "Who owes what, when, and to whom?" (OBLIGATION vs RIGHT).
      • Look for MUST/SHALL (mandatory), MAY (permissive), WILL (future fact), 
        and NEGATIVES (e.g. "not", "except").
      • Spot money movement (fees, royalties, set-offs) → PAYMENT or FINANCIAL risk.
      • Map default/termination triggers and cure periods → TERMINATION.
      • Search for liability caps, baskets, exclusions → LIMITATION_OF_LIABILITY.
      • Scan for broad indemnities ("indemnify, defend, hold harmless").
      • Check governing-law + jurisdiction for venue shopping risk.
      • Compare carve-outs and "material" modifiers → scope narrowing.
      • If wording is vague ("reasonable"), flag as OPERATIONAL risk.
      • Severity heuristic:  
          CRITICAL = existential threat or unenforceable term,  
          HIGH     = significant financial/legal exposure (>10 % contract value),  
          MEDIUM   = manageable with monitoring or insurance,  
          LOW      = paper-only / remote likelihood.
      • Mitigation tip style: imperative, ≤ 120 characters ("Negotiate 30-day cure period"). 
      `;

    /**
     * Few-shot example: <80 lines and 100 % compliant with the AnalysisSchema.
     * Keep one small but realistic snippet so the model "sees" the target JSON
     * structure in action without bloating context.
     */
    const FEW_SHOT_EXAMPLE = `
        EXAMPLE
      ========
      <<SECTION>>
      The Licensee shall pay the Licensor a non-refundable upfront fee of
      INR 5,00,000 within seven (7) days of the Effective Date.  The Licensor
      shall indemnify, defend and hold harmless the Licensee against any claim
      that the Software infringes third-party IP rights, provided that the
      Licensee promptly notifies the Licensor of such claim.
      <<END SECTION>>

      <<DESIRED_JSON>>
      {
        "sectionTitle": "",
        "clauses": [
          {
            "id": 1,
            "text": "The Licensee shall pay ... seven (7) days of the Effective Date.",
            "type": "PAYMENT",
            "obligation": "OBLIGATION",
            "startIndex": 0,
            "endIndex": 119,
            "confidence": 0.96
          },
          {
            "id": 2,
            "text": "The Licensor shall indemnify, defend and hold harmless ... such claim.",
            "type": "INDEMNITY",
            "obligation": "OBLIGATION",
            "startIndex": 122,
            "endIndex": 262,
            "confidence": 0.93
          }
        ],
        "risks": [
          {
            "id": 1,
            "clauseId": 1,
            "type": "FINANCIAL",
            "description": "Up-front fee due in 7 days may stress Licensee cash-flow.",
            "severity": "MEDIUM",
            "mitigation": "Negotiate 30-day payment window",
            "confidence": 0.88
          },
          {
            "id": 2,
            "clauseId": 2,
            "type": "LEGAL",
            "description": "Indemnity lacks liability cap exposing Licensor to unlimited damages.",
            "severity": "HIGH",
            "mitigation": "Insert INR 1 cr liability cap",
            "confidence": 0.91
          }
        ]
      }
      <<END>>
      `;

    /**
     * ✔  Uses explicit instructions ("do NOT …") to prevent markdown, prose, or
     *    hallucinated keys.
     * ✔  Explains enumerations once so the model does not invent new variants.
     * ✔  Mentions empty-array rule — no nulls/omissions.
     * ✔  Reminds the model to think silently first (chain-of-thought is hidden).
     */
    const prompt = PromptTemplate.fromTemplate(`
      You are **Contract-Analysis-GPT**, a senior commercial lawyer and risk
      analyst.  Your output MUST be a single JSON object that exactly matches
      the Zod schema shown below – no markdown, no extra keys.

      ${LEGAL_PLAYBOOK}      

      ${FEW_SHOT_EXAMPLE}

      TASK
      ----
      Analyse the **Section** text of a {contractType} contract and return a JSON object
      that matches the exact Zod schema shown below — no extra keys, no markdown.

      RULES
      1. Think through the text internally, but only output the final JSON.
      2. Use the enumerations exactly as written (case-sensitive).
      3. If something is unknown or not present, use "" for strings or [] for arrays.
      4. The array order must follow the order of appearance in the section.
      5. <startIndex, endIndex> must map to the original Section string.
      6. confidence is a decimal between 0 and 1 with 2-decimal precision.
      7. If no clauses or risks are found, still return the property with an empty array.

      SCHEMA
      \`\`\`json
      ${schemaDescription}
      \`\`\`

      SECTION START
      --------------
      {text}
      SECTION END
      `);

    // Use .withStructuredOutput if available
    let result: any;
    if (typeof (this.llm as any).model?.withStructuredOutput === 'function') {
      const modelWithSchema = (this.llm as any).model.withStructuredOutput(
        AnalysisSchema,
      );
      result = await modelWithSchema.invoke(
        {
          contractType,
          text: doc.pageContent,
        },
        { callbacks: [this.langfuseHandler] },
      );
    } else {
      // Fallback to old approach
      const chain = RunnableSequence.from([
        prompt,
        (input: any) => this.llm.invoke(input),
        new StringOutputParser(),
      ]);
      const raw = await chain.invoke(
        {
          contractType,
          text: doc.pageContent,
        },
        { callbacks: [this.langfuseHandler] },
      );
      try {
        result = AnalysisSchema.parse(JSON.parse(raw));
      } catch (e) {
        throw new Error('Failed to parse analysis result: ' + e);
      }
    }
    return result;
  }

  private async generateSummary(
    text: string,
    contractType: string,
  ): Promise<z.infer<typeof ContractSummarySchema>> {
    const schemaDescription = zodSchemaToPromptDescription(
      ContractSummarySchema,
    );
    const prompt = PromptTemplate.fromTemplate(`
      You are **Contract-Digest-GPT**, a senior commercial lawyer.  
      Your task is to produce a concise, lawyer-ready executive summary of the contract
      text provided below.  Follow the structure and rules exactly.

      ──────────────────────── SCHEMA ────────────────────────
      ${schemaDescription}
      ─────────────────────────────────────────────────────────

      ──────────────────────────────────────────────────────────────────────────────
      GUIDELINES
      1. Think silently; reveal *only* the final JSON.
      2. Populate every required key. Use "" for strings or [] for arrays when data
        is absent.  Never omit keys.
      3. Date format → "dd MMM yyyy" (e.g., "05 Feb 2025").
      4. Currency → ISO-4217 code + number (e.g., 123456.78 "INR").
      5. Clause references: literal number/heading as it appears, else "-".
      6. \`risks\` array ≤ 3 items ordered by severity (HIGH→LOW).
      7. \`abstract\` ≤ 42 words, plain English, no legalese.
      8. No markdown, comments, or explanatory prose—JSON only.

      ──────────────────────────────────────────────────────────────────────────────
      CONTRACT TEXT BEGINS
      {text}
      ──────────────────────────────────────────────────────────────────────────────
      CONTRACT TEXT ENDS
      `);

    let result: any;
    if (typeof (this.llm as any).model?.withStructuredOutput === 'function') {
      const modelWithSchema = (this.llm as any).model.withStructuredOutput(
        ContractSummarySchema,
      );
      result = await modelWithSchema.invoke(
        {
          contractType,
          text,
        },
        { callbacks: [this.langfuseHandler] },
      );
    } else {
      const chain = RunnableSequence.from([
        prompt,
        (input: any) => this.llm.invoke(input),
        new StringOutputParser(),
      ]);
      const raw = await chain.invoke(
        {
          contractType,
          text,
        },
        { callbacks: [this.langfuseHandler] },
      );
      try {
        result = ContractSummarySchema.parse(JSON.parse(raw));
      } catch (e) {
        throw new Error('Failed to parse summary result: ' + e);
      }
    }
    return result;
  }

  async answerQuestion(
    question: string,
    context: string,
  ): Promise<{ answer: string; confidence: number }> {
    // Define Zod schema for structured output with descriptions
    const AnswerSchema = z.object({
      answer: z.string().describe("The answer to the user's question"),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score between 0 and 1'),
    });

    const schemaDescription = zodSchemaToPromptDescription(AnswerSchema);

    const prompt = PromptTemplate.fromTemplate(`
      Answer the following question based on the provided contract context.
      If you cannot find a definitive answer in the context, say so.

      Context: {context}
      Question: {question}

      Provide your answer in JSON format with the following schema:
      ${schemaDescription}
    `);

    let result: any;
    if (typeof (this.llm as any).model?.withStructuredOutput === 'function') {
      const modelWithSchema = (this.llm as any).model.withStructuredOutput(
        AnswerSchema,
      );
      result = await modelWithSchema.invoke(
        {
          context,
          question,
        },
        { callbacks: [this.langfuseHandler] },
      );
    } else {
      const chain = RunnableSequence.from([
        prompt,
        (input: any) => this.llm.invoke(input),
        new StringOutputParser(),
      ]);
      const raw = await chain.invoke(
        {
          context,
          question,
        },
        { callbacks: [this.langfuseHandler] },
      );
      try {
        result = AnswerSchema.parse(JSON.parse(raw));
      } catch (e) {
        throw new Error('Failed to parse answer result: ' + e);
      }
    }
    return result;
  }

  async compareWithTemplate(
    clauseText: string,
    templateText: string,
  ): Promise<{
    differences: string[];
    suggestedChanges: string[];
    riskLevel: string;
  }> {
    // Define Zod schema for structured output with descriptions
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

    const schemaDescription = zodSchemaToPromptDescription(CompareSchema);

    const prompt = PromptTemplate.fromTemplate(`
      Compare the following clause with the template clause and identify:
      1. Key differences
      2. Suggested changes to align with the template
      3. Overall risk level (LOW/MEDIUM/HIGH)

      Clause Text: {clauseText}
      Template Text: {templateText}

      Provide the analysis in JSON format with the following schema:
      ${schemaDescription}
    `);

    let result: any;
    if (typeof (this.llm as any).model?.withStructuredOutput === 'function') {
      const modelWithSchema = (this.llm as any).model.withStructuredOutput(
        CompareSchema,
      );
      result = await modelWithSchema.invoke(
        {
          clauseText,
          templateText,
        },
        { callbacks: [this.langfuseHandler] },
      );
    } else {
      const chain = RunnableSequence.from([
        prompt,
        (input: any) => this.llm.invoke(input),
        new StringOutputParser(),
      ]);
      const raw = await chain.invoke(
        {
          clauseText,
          templateText,
        },
        { callbacks: [this.langfuseHandler] },
      );
      try {
        result = CompareSchema.parse(JSON.parse(raw));
      } catch (e) {
        throw new Error('Failed to parse compare result: ' + e);
      }
    }
    return result;
  }
}
