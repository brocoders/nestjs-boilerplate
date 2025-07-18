import { Allow } from 'class-validator';

export class Logs {
  @Allow()
  id: string;

  @Allow()
  path: string;

  message: JSON;
  stack: JSON;
  method: string;
  payload?: JSON | null;
  status: number;
}
