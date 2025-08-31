export type AppConfig = {
  nodeEnv: string;
  dbType: string;
  name: string;
  version: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  monitorSampleMs: number;
};
