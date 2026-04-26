import { registerAs } from '@nestjs/config';
import { IsInt, IsString, Max, Min } from 'class-validator';
import validateConfig from '../../utils/validate-config';

export type RedisConfig = {
  host: string;
  port: number;
};

class EnvironmentVariablesValidator {
  @IsString() REDIS_HOST!: string;
  @IsInt() @Min(0) @Max(65535) REDIS_PORT!: number;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
  };
});
