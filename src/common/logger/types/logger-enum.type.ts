export enum LoggerType {
  SYSTEM = 'system',
  DEV = 'dev',
  QUERY = 'query',
  ERROR = 'error',
  HTTP = 'http',
  STARTUP = 'startup',
  LIFECYCLE = 'lifecycle',
  MICROSERVICE = 'microservice',
}

export enum LoggerScope {
  GLOBAL = 'global',
  REQUEST = 'request',
}

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}
