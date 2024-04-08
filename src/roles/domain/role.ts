import { Allow } from 'class-validator';

export class Role {
  @Allow()
  id: number | string;

  @Allow()
  name?: string;
}
