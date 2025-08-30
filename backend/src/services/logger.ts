import winston from 'winston';
import 'winston-daily-rotate-file';
import { Request } from 'express';
import { LogLevel, LogEntry, BackendLogOptions } from '../types/logging';
import { getLoggingConfig } from '../config/logging';

class BackendLogger {
  private winston: winston.Logger;
  private config = getLoggingConfig();

  constructor() {
    this.winston = winston.createLogger({
      level: this.config.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: this.createTransports()
    });

    // Add console transport for development
    if (this.config.enableConsole) {
      this.winston.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }

    // Handle uncaught exceptions and unhandled rejections
    if (this.config.enableFile) {
      this.winston.exceptions.handle(
        new winston.transports.DailyRotateFile({
          filename: `${this.config.logDirectory}/exceptions-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          zippedArchive: this.config.enableCompression
        })
      );

      this.winston.rejections.handle(
        new winston.transports.DailyRotateFile({
          filename: `${this.config.logDirectory}/rejections-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          zippedArchive: this.config.enableCompression
        })
      );
    }
  }

  private createTransports(): winston.transport[] {
    const transports: winston.transport[] = [];

    if (this.config.enableFile) {
      if (this.config.enableRotation) {
        // Error logs with rotation
        transports.push(new winston.transports.DailyRotateFile({
          filename: `${this.config.logDirectory}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          zippedArchive: this.config.enableCompression
        }));

        // Combined logs with rotation
        transports.push(new winston.transports.DailyRotateFile({
          filename: `${this.config.logDirectory}/combined-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          zippedArchive: this.config.enableCompression
        }));

        // Security logs with rotation
        if (this.config.enableSecurityLogging) {
          transports.push(new winston.transports.DailyRotateFile({
            filename: `${this.config.logDirectory}/security-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'warn',
            maxSize: this.config.maxFileSize,
            maxFiles: this.config.maxFiles,
            zippedArchive: this.config.enableCompression
          }));
        }
      } else {
        // Simple file logging for development
        transports.push(new winston.transports.File({ 
          filename: `${this.config.logDirectory}/error.log`, 
          level: 'error' 
        }));
        transports.push(new winston.transports.File({ 
          filename: `${this.config.logDirectory}/combined.log` 
        }));
      }
    }

    return transports;
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

  fatal(message: string, error?: Error, options?: BackendLogOptions): void {
    this.log('fatal', message, {
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
    if (!this.config.enableSecurityLogging) return;

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

  performance(operation: string, duration: number, metadata?: object): void {
    if (!this.config.enablePerformanceLogging) return;

    this.log('info', `Performance: ${operation}`, {
      component: 'Performance',
      action: 'performance_measurement',
      duration,
      metadata
    });
  }

  userAction(action: string, userId: string, metadata?: object): void {
    if (!this.config.enableUserActionLogging) return;

    this.log('info', `User Action: ${action}`, {
      component: 'User',
      action: 'user_action',
      userId,
      metadata
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

    // Send to external monitoring if enabled
    if (this.config.enableExternalMonitoring && (level === 'error' || level === 'fatal')) {
      this.sendToExternalMonitoring(logEntry);
    }
  }

  private async sendToExternalMonitoring(logEntry: LogEntry): Promise<void> {
    try {
      if (this.config.externalMonitoringUrl && this.config.externalMonitoringApiKey) {
        await fetch(this.config.externalMonitoringUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.externalMonitoringApiKey}`
          },
          body: JSON.stringify(logEntry)
        });
      }
    } catch (error) {
      // Don't let external monitoring failures break logging
      this.winston.warn('Failed to send to external monitoring', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Method to update configuration at runtime
  updateConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update log level
    this.winston.level = this.config.level;
    
    // Log configuration change
    this.info('Logging configuration updated', {
      component: 'Logger',
      action: 'config_updated',
      metadata: { newConfig: this.config }
    });
  }

  // Method to get current configuration
  getConfig(): typeof this.config {
    return { ...this.config };
  }
}

export const logger = new BackendLogger();
