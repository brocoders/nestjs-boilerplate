import { registerAs } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  TWITTER_CONSUMER_KEY: string;

  @IsString()
  @IsOptional()
  TWITTER_CONSUMER_SECRET: string;
}

export default registerAs('twitter', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  };
});
