export type LoggerConfig = {
  level?: string;
  consoleEnabled?: boolean;
  fileEnabled?: boolean;
  filePath?: string;
  remoteEnabled?: boolean;
  remoteEndpoint?: string;
  context?: string;
};
