import { Allow } from 'class-validator';

export class Status {
  @Allow()
  id: number | string;

  @Allow()
  name?: string;
}
