export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  corsOrigins: string[];
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
