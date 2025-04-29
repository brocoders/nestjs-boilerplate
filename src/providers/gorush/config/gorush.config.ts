import { IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { GorushConfig } from './gorush-config.type';
import {
  GORUSH_ENABLE,
  GORUSH_URL,
  GORUSH_TIMEOUT_INTERVAL,
} from '../types/gorush-const.type';
import { createToggleableConfig } from '../../../config/config.helper';

class EnvironmentVariablesValidator {
  @IsString()
  GORUSH_URL: string;

  @IsBoolean()
  GORUSH_ENABLE: boolean;

  @IsInt()
  @Min(5000)
  @Max(10000)
  GORUSH_REQUEST_TIMEOUT: number;
}

export default createToggleableConfig<GorushConfig>(
  'gorush',
  EnvironmentVariablesValidator,
  {
    baseUrl: GORUSH_URL,
    requestTimeOut: GORUSH_TIMEOUT_INTERVAL,
    enable: GORUSH_ENABLE,
  },
  'enable',
  'GORUSH_ENABLE',
);
