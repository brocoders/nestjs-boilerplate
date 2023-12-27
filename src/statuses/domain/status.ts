import { Allow } from 'class-validator';

export class Status {
  @Allow()
  id: number;

  @Allow()
  name?: string;
}
