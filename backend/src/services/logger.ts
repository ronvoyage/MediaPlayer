import winston from 'winston';
import { Request } from 'express';
import { LogLevel, LogEntry, BackendLogOptions } from '../types/logging';

class BackendLogger {
  private winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        })
      ]
    });

    // Add console transport for development
    if (process.env.NODE_ENV !== 'production') {
      this.winston.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }

  debug(message: string, options?: BackendLogOptions): void {
    this.log('debug', message, options);
  }

  info(message: string, options?: BackendLogOptions): void {
    this.log('info', message, options);
  }

  warn(message: string, options?: BackendLogOptions): void {
    this.log('warn', message, options);
  }

  error(message: string, error?: Error, options?: BackendLogOptions): void {
    this.log('error', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
        code: (error as any).code
      } : undefined
    });
  }

  apiRequest(req: Request, duration: number, statusCode: number): void {
    this.log('info', `API Request: ${req.method} ${req.path}`, {
      component: 'API',
      action: 'request',
      duration,
      metadata: {
        method: req.method,
        path: req.path,
        statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      },
      requestId: req.headers['x-request-id'] as string
    });
  }

  security(message: string, req: Request, riskLevel: 'low' | 'medium' | 'high'): void {
    this.log('warn', message, {
      component: 'Security',
      action: 'security_event',
      security: {
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        risk: riskLevel
      },
      requestId: req.headers['x-request-id'] as string
    });
  }

  private log(level: LogLevel, message: string, options?: BackendLogOptions): void {
    const logEntry: LogEntry = {
      service: 'backend',
      level,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.winston.log(level, message, logEntry);
  }
}

export const logger = new BackendLogger();
