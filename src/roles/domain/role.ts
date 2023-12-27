import { Allow, IsNumber } from 'class-validator';

export class Role {
  @IsNumber()
  id: number;

  @Allow()
  name?: string;
}
