import { z } from 'zod';

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
    .describe('Model confidence that the text is correctly classified (0-1)'),
});

const RiskSchema = z.object({
  id: z
    .number()
    .int()
    .describe('Running index starting at 1, unique within the section'),
  clauseId: z
    .number()
    .int()
    .describe('ID of the clause this risk relates to (or 0 if section-level)'),
  type: RiskTypeEnum.describe('Normalized risk bucket'),
  description: z.string().describe('Human-readable explanation of the risk'),
  severity: SeverityEnum.describe('Impact x likelihood'),
  mitigation: z
    .string()
    .describe('Concise, actionable mitigation recommendation (<=120 chars)'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Model confidence that the risk is correctly identified (0-1)'),
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

export { ClauseSchema, RiskSchema, AnalysisSchema };
