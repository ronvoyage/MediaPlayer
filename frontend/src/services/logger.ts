import { v4 as uuidv4 } from 'uuid';
import type { LogLevel, LogEntry, LogOptions } from '../types/logging';

class FrontendLogger {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = uuidv4();
    this.initializePerformanceMonitoring();
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  debug(message: string, options?: LogOptions): void {
    if (import.meta.env.DEV) {
      this.log('debug', message, options);
    }
  }

  info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  error(message: string, error?: Error, options?: LogOptions): void {
    this.log('error', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } : undefined
    });
  }

  performance(message: string, duration: number, options?: LogOptions): void {
    this.log('info', message, {
      ...options,
      duration,
      performance: {
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        timing: performance.timing || {}
      }
    });
  }

  userAction(action: string, component: string, metadata?: object): void {
    this.log('info', `User action: ${action}`, {
      component,
      action,
      metadata
    });
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'frontend',
      message,
      sessionId: this.sessionId,
      userId: this.userId,
      ...options
    };

    // Console output in development
    if (import.meta.env.DEV) {
      this.consoleOutput(logEntry);
    }

    // Send to backend or logging service
    this.sendToBackend(logEntry);
  }

  private consoleOutput(logEntry: LogEntry): void {
    const style = this.getConsoleStyle(logEntry.level);
    const component = logEntry.component || 'App';
    
    console.log(
      `%c[${logEntry.level.toUpperCase()}] ${component}: ${logEntry.message}`,
      style,
      logEntry
    );
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888',
      info: 'color: #2196F3',
      warn: 'color: #FF9800',
      error: 'color: #F44336; font-weight: bold',
      fatal: 'color: #D32F2F; font-weight: bold; background: #FFEBEE'
    };
    return styles[level];
  }

  private async sendToBackend(logEntry: LogEntry): Promise<void> {
    try {
      // Only send to backend if it's running (avoid errors during development)
      if (import.meta.env.PROD || import.meta.env.VITE_BACKEND_URL) {
        await fetch('/api/v1/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry)
        });
      }
    } catch (error) {
      // Fallback logging - don't let logging failures break the app
      if (import.meta.env.DEV) {
        console.warn('Failed to send log to backend:', error);
      }
    }
  }

  private initializePerformanceMonitoring(): void {
    // Monitor page load performance
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing;
          const loadTime = perfData.loadEventEnd - perfData.navigationStart;
          this.performance('Page load completed', loadTime, {
            component: 'App',
            action: 'page_load'
          });
        }, 0);
      });
    }
  }
}

export const logger = new FrontendLogger();
