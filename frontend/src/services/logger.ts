import { v4 as uuidv4 } from 'uuid';
import type { LogLevel, LogEntry, LogOptions } from '../types/logging';

class FrontendLogger {
  private sessionId: string;
  private userId?: string;
  private errorCount: number = 0;
  private performanceMetrics: Map<string, number[]> = new Map();
  private errorThreshold: number = 10; // Alert after 10 errors
  private errorWindow: number = 60000; // 1 minute window

  constructor() {
    this.sessionId = uuidv4();
    this.initializePerformanceMonitoring();
    this.initializeErrorMonitoring();
    this.initializeSecurityMonitoring();
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
    this.errorCount++;
    this.log('error', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } : undefined
    });

    // Check if we need to alert about error frequency
    this.checkErrorThreshold();
  }

  fatal(message: string, error?: Error, options?: LogOptions): void {
    this.errorCount++;
    this.log('fatal', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } : undefined
    });

    // Fatal errors always trigger alerts
    this.alertError('FATAL_ERROR', message, error);
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

    // Track performance metrics for analysis
    this.trackPerformanceMetric(message, duration);
  }

  userAction(action: string, component: string, metadata?: object): void {
    this.log('info', `User action: ${action}`, {
      component,
      action,
      metadata
    });
  }

  security(message: string, metadata?: object): void {
    this.log('warn', message, {
      component: 'Security',
      action: 'security_event',
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

    // Send to external monitoring in production
    if (import.meta.env.PROD) {
      this.sendToExternalMonitoring(logEntry);
    }
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

  private async sendToExternalMonitoring(logEntry: LogEntry): Promise<void> {
    // In production, send critical logs to external monitoring services
    if (logEntry.level === 'error' || logEntry.level === 'fatal') {
      try {
        // Example: Send to external error tracking service
        // await fetch('https://api.external-monitoring.com/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(logEntry)
        // });
      } catch (error) {
        // Silently fail - don't break the app
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

      // Monitor memory usage
      if ((performance as any).memory) {
        setInterval(() => {
          const memory = (performance as any).memory;
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
            this.warn('High memory usage detected', {
              component: 'Performance',
              action: 'memory_warning',
              metadata: {
                used: memory.usedJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
              }
            });
          }
        }, 30000); // Check every 30 seconds
      }
    }
  }

  private initializeErrorMonitoring(): void {
    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.error('Unhandled error', event.error, {
          component: 'Global',
          action: 'unhandled_error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection', new Error(event.reason), {
          component: 'Global',
          action: 'unhandled_rejection',
          metadata: {
            reason: event.reason
          }
        });
      });
    }
  }

  private initializeSecurityMonitoring(): void {
    // Monitor for suspicious activities
    if (typeof window !== 'undefined') {
      // Monitor for multiple failed login attempts
      let failedAttempts = 0;
      const maxFailedAttempts = 5;

      // Example: Monitor for rapid clicking (potential bot activity)
      let clickCount = 0;
      let lastClickTime = Date.now();

      document.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < 100) { // Less than 100ms between clicks
          clickCount++;
          if (clickCount > 20) { // More than 20 rapid clicks
            this.security('Suspicious rapid clicking detected', {
              component: 'Security',
              action: 'suspicious_activity',
              metadata: {
                clickCount,
                timeWindow: now - lastClickTime
              }
            });
            clickCount = 0;
          }
        } else {
          clickCount = 0;
        }
        lastClickTime = now;
      });
    }
  }

  private checkErrorThreshold(): void {
    // Reset error count after error window
    setTimeout(() => {
      this.errorCount = Math.max(0, this.errorCount - 1);
    }, this.errorWindow);

    // Alert if error threshold is exceeded
    if (this.errorCount >= this.errorThreshold) {
      this.alertError('ERROR_THRESHOLD_EXCEEDED', 
        `Error threshold exceeded: ${this.errorCount} errors in ${this.errorWindow}ms`);
    }
  }

  private alertError(type: string, message: string, error?: Error): void {
    // In development, show alert
    if (import.meta.env.DEV) {
      console.error(`🚨 ALERT: ${type} - ${message}`, error);
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      this.sendToExternalMonitoring({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'frontend',
        message: `ALERT: ${type} - ${message}`,
        sessionId: this.sessionId,
        userId: this.userId,
        component: 'Monitoring',
        action: 'error_alert',
        metadata: { alertType: type, errorCount: this.errorCount }
      });
    }
  }

  private trackPerformanceMetric(operation: string, duration: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(duration);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Alert if performance degrades significantly
    if (metrics.length >= 10) {
      const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const recent = metrics.slice(-5).reduce((a, b) => a + b, 0) / 5;
      
      if (recent > avg * 2) { // Performance degraded by 2x
        this.warn('Performance degradation detected', {
          component: 'Performance',
          action: 'performance_degradation',
          metadata: {
            operation,
            average: avg,
            recent: recent,
            degradation: (recent / avg) * 100
          }
        });
      }
    }
  }

  // Public method to get performance metrics for debugging
  getPerformanceMetrics(): Map<string, number[]> {
    return new Map(this.performanceMetrics);
  }

  // Public method to get error count for debugging
  getErrorCount(): number {
    return this.errorCount;
  }
}

export const logger = new FrontendLogger();
