import 'reflect-metadata';
import validateConfig from '../validate-config';
import { IsNumber, IsString } from 'class-validator';

class Env {
  @IsString()
  NAME!: string;

  @IsNumber()
  PORT!: number;
}

describe('validateConfig', () => {
  it('should transform and validate configuration', () => {
    const result = validateConfig({ NAME: 'app', PORT: '3000' }, Env);
    expect(result).toEqual({ NAME: 'app', PORT: 3000 });
  });

  it('should throw for invalid config', () => {
    expect(() => validateConfig({ NAME: 123 }, Env)).toThrow();
  });
});
