export class FxRate {
  id!: string;
  baseCurrency!: string;
  quoteCurrency!: string;
  rate!: string; // numeric string for precision
  fetchedDate!: string; // YYYY-MM-DD
  fetchedAt!: Date;
  source!: string;
}
