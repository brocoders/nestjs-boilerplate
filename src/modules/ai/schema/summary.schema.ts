import { z } from 'zod';

/* ─────────────────────────  Core Re-usable Enums ────────────────────────── */

export const RiskSeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const RenewalTypeEnum = z.enum(['AUTO', 'MANUAL', 'NONE']);

export const TimeUnitEnum = z.enum(['DAY', 'MONTH', 'YEAR']);

/* ──────────────────────────────  Sub-Schemas ────────────────────────────── */

const PartySchema = z.object({
  name: z.string().describe('Full legal name as it appears in the contract'),
  alias: z
    .string()
    .optional()
    .describe('Short name / acronym used in the document, if any'),
  role: z
    .string()
    .optional()
    .describe('Role in the transaction, e.g. "Seller", "Licensee"'),
});

const TermSchema = z.object({
  value: z.number().positive().describe('Numeric length of the term'),
  unit: TimeUnitEnum.describe('Unit of the term length'),
});

const RenewalSchema = z.object({
  type: RenewalTypeEnum.describe('Whether the contract renews automatically'),
  period: TermSchema.optional().describe('Length of each renewal cycle'),
});

const KeyTermsSchema = z.object({
  deliverables: z
    .string()
    .describe('Plain-language description of the main goods/services'),
  payment: z.object({
    currency: z
      .string()
      .length(3)
      .describe('ISO-4217 currency code, e.g. "INR"'),
    amount: z.number().describe('Total or recurring payment amount'),
    schedule: z.string().describe('Payment frequency / due dates'),
  }),
  milestones: z.string().optional().describe('Performance milestones or SLAs'),
  terminationTriggers: z
    .string()
    .describe('Summary of clauses that allow parties to exit'),
  liabilityCaps: z
    .string()
    .optional()
    .describe('Monetary or percentage caps on liability / indemnity'),
});

const ObligationSchema = z.object({
  party: z.string().describe('Name or alias of the obligated party'),
  text: z.string().describe('Verbatim or summarised obligation wording'),
});

const CriticalDateSchema = z.object({
  date: z.string().describe('dd MMM yyyy format (e.g., "05 Feb 2025")'),
  description: z.string().describe('What happens on this date'),
  clauseRef: z.string().describe('Clause number or "–" if absent'),
});

const NoteworthyClauseSchema = z.object({
  clauseRef: z.string().describe('Clause number (e.g., "§12.4")'),
  summary: z.string().describe('Why this clause is unusual or material'),
});

const RiskSchema = z.object({
  description: z.string().describe('Concise articulation of the risk'),
  severity: RiskSeverityEnum.describe('Impact × likelihood assessment'),
  clauseRef: z.string().describe('Linked clause number, if any'),
});

/* ───────────────────────────  Root Summary Schema ───────────────────────── */

export const ContractSummarySchema = z.object({
  snapshot: z.object({
    contractType: z.string().describe('e.g. "Software Licence"'),
    parties: z
      .array(PartySchema)
      .min(2)
      .describe('Principal contracting entities'),
    effectiveDate: z
      .string()
      .describe('dd MMM yyyy format of contract start date'),
    initialTerm: TermSchema.describe('Length of the initial commitment'),
    renewal: RenewalSchema.describe('Auto-renewal details'),
    governingLaw: z.string().describe('Jurisdiction governing the contract'),
  }),

  keyTerms: KeyTermsSchema,

  obligationsByParty: z
    .array(ObligationSchema)
    .describe('Bulletised obligations grouped by party'),

  criticalDates: z
    .array(CriticalDateSchema)
    .describe('Table of dates the user must track'),

  noteworthyClauses: z
    .array(NoteworthyClauseSchema)
    .describe('Clauses diverging from standard market practice'),

  risks: z.array(RiskSchema).max(3).describe('High-level risk register'),

  abstract: z.string().max(300).describe('≤ 42-word plain-English one-liner'),

  generatedAt: z
    .string()
    .optional()
    .describe('ISO timestamp when the summary was produced'),
});
