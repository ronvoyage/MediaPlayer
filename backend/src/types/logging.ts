export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: 'frontend' | 'backend';
  message: string;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  metadata?: object;
  error?: {
    name: string;
    message: string;
    stack: string;
    code?: string;
  };
  performance?: {
    memory: number;
    timing: object;
  };
  security?: {
    ip: string;
    userAgent: string;
    risk: 'low' | 'medium' | 'high';
  };
}

export interface BackendLogOptions {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  metadata?: object;
  error?: {
    name: string;
    message: string;
    stack: string;
    code?: string;
  };
  security?: {
    ip: string;
    userAgent: string;
    risk: 'low' | 'medium' | 'high';
  };
}
