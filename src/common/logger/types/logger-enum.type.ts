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
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARN = 'WARN',
  LOG = 'LOG',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}
