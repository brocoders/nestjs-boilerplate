export enum LoggerType {
  SYSTEM = 'SYSTEM',
  DEV = 'DEV',
  QUERY = 'QUARY',
  HTTP = 'HTTP',
  STARTUP = 'PROVIDER',
  MICROSERVICE = 'MICROSERVICE',
}

export enum LoggerScope {
  GLOBAL = 'global',
  REQUEST = 'request',
}

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  TRACE = 'trace',
}
