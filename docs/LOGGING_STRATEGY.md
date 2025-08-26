# Logging Strategy & Infrastructure

## Overview
Comprehensive logging infrastructure is critical for debugging, monitoring, performance analysis, and security auditing. This document outlines the logging strategy for the MediaPlayer application.

## Logging Philosophy
- **Structured Logging**: All logs use consistent JSON format
- **Contextual Information**: Include user, session, and request context
- **Performance Awareness**: Log performance metrics and bottlenecks
- **Security Focus**: Track authentication and suspicious activities
- **Development Friendly**: Rich local logging for debugging
- **Production Ready**: Scalable, searchable, and alertable logs

## Log Levels

### Debug (Development Only)
- Component lifecycle events
- State changes and updates
- Detailed API request/response data
- Cache hit/miss information

### Info
- User actions (login, play media, create playlist)
- System events (theme changes, page navigation)
- Successful API operations
- Performance milestones

### Warn
- Deprecated feature usage
- Recoverable errors
- Performance warnings (slow operations)
- Invalid user inputs (handled gracefully)

### Error
- Component crashes
- API failures
- Authentication failures
- File processing errors
- Network timeouts

### Fatal
- Application crashes
- Database connection failures
- Critical security breaches
- System resource exhaustion

## Log Structure

### Standard Log Format
```typescript
interface LogEntry {
  timestamp: string;          // ISO 8601 format
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  service: 'frontend' | 'backend';
  message: string;
  component?: string;         // React component or backend module
  action?: string;           // User action or system operation
  userId?: string;           // Current user ID (if authenticated)
  sessionId: string;         // Session identifier
  requestId?: string;        // Backend request correlation ID
  duration?: number;         // Operation duration in ms
  metadata?: object;         // Additional contextual data
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
```

### Example Log Entries
```json
{
  "timestamp": "2025-08-26T14:30:15.123Z",
  "level": "info",
  "service": "frontend",
  "message": "User initiated media playback",
  "component": "MediaPlayer",
  "action": "play_media",
  "userId": "user_123",
  "sessionId": "session_456",
  "duration": 250,
  "metadata": {
    "mediaId": "media_789",
    "mediaType": "audio",
    "format": "mp3",
    "source": "local"
  }
}

{
  "timestamp": "2025-08-26T14:30:16.456Z",
  "level": "error",
  "service": "backend",
  "message": "Failed to authenticate user",
  "component": "AuthService",
  "action": "login_attempt",
  "sessionId": "session_789",
  "requestId": "req_101112",
  "error": {
    "name": "AuthenticationError",
    "message": "Invalid credentials",
    "code": "AUTH_001"
  },
  "security": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "risk": "medium"
  }
}
```

## Implementation

### Frontend Logger Service
```typescript
// src/services/logger.ts
import { v4 as uuidv4 } from 'uuid';

class FrontendLogger {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = uuidv4();
    this.initializePerformanceMonitoring();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  info(message: string, options?: LogOptions) {
    this.log('info', message, options);
  }

  warn(message: string, options?: LogOptions) {
    this.log('warn', message, options);
  }

  error(message: string, error?: Error, options?: LogOptions) {
    this.log('error', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } : undefined
    });
  }

  performance(message: string, duration: number, options?: LogOptions) {
    this.log('info', message, {
      ...options,
      duration,
      performance: {
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        timing: performance.timing
      }
    });
  }

  userAction(action: string, component: string, metadata?: object) {
    this.log('info', `User action: ${action}`, {
      component,
      action,
      metadata
    });
  }

  private log(level: LogLevel, message: string, options?: LogOptions) {
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
    if (process.env.NODE_ENV === 'development') {
      this.consoleOutput(logEntry);
    }

    // Send to backend or logging service
    this.sendToBackend(logEntry);
  }

  private consoleOutput(logEntry: LogEntry) {
    const style = this.getConsoleStyle(logEntry.level);
    console.log(
      `%c[${logEntry.level.toUpperCase()}] ${logEntry.component || 'App'}: ${logEntry.message}`,
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

  private async sendToBackend(logEntry: LogEntry) {
    try {
      await fetch('/api/v1/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Fallback logging - don't let logging failures break the app
      console.warn('Failed to send log to backend:', error);
    }
  }
}

export const logger = new FrontendLogger();
```

### Backend Logger Service
```typescript
// src/services/logger.ts
import winston from 'winston';
import { Request } from 'express';

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

    if (process.env.NODE_ENV !== 'production') {
      this.winston.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }

  info(message: string, options?: BackendLogOptions) {
    this.log('info', message, options);
  }

  warn(message: string, options?: BackendLogOptions) {
    this.log('warn', message, options);
  }

  error(message: string, error?: Error, options?: BackendLogOptions) {
    this.log('error', message, {
      ...options,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } : undefined
    });
  }

  apiRequest(req: Request, duration: number, statusCode: number) {
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

  security(message: string, req: Request, riskLevel: 'low' | 'medium' | 'high') {
    this.log('warn', message, {
      component: 'Security',
      action: 'security_event',
      security: {
        ip: req.ip,
        userAgent: req.get('User-Agent') || 'unknown',
        risk: riskLevel
      },
      requestId: req.headers['x-request-id'] as string
    });
  }

  private log(level: LogLevel, message: string, options?: BackendLogOptions) {
    const logEntry = {
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
```

## Integration Points

### React Components
```typescript
// Automatic logging for all user interactions
function useLogger(componentName: string) {
  const logUserAction = (action: string, metadata?: object) => {
    logger.userAction(action, componentName, metadata);
  };

  const logError = (error: Error, context?: string) => {
    logger.error(`Component error in ${componentName}: ${context}`, error, {
      component: componentName
    });
  };

  return { logUserAction, logError };
}

// Usage in components
function MediaPlayer() {
  const { logUserAction, logError } = useLogger('MediaPlayer');

  const handlePlay = () => {
    try {
      logUserAction('play', { mediaId: currentMedia.id });
      // ... play logic
    } catch (error) {
      logError(error, 'Failed to start playback');
    }
  };
}
```

### Express Middleware
```typescript
// Request logging middleware
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.apiRequest(req, duration, res.statusCode);
  });
  
  next();
}

// Error handling middleware
function errorLogger(error: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('API Error', error, {
    component: 'API',
    requestId: req.headers['x-request-id'] as string,
    metadata: {
      method: req.method,
      path: req.path,
      body: req.body
    }
  });
  
  next(error);
}
```

## Log Storage & Analysis

### Development Environment
- **Console output** with colored formatting
- **Local file storage** for debugging
- **Browser DevTools** integration

### Production Environment
- **Cloud logging service** (Google Cloud Logging, AWS CloudWatch, or ELK Stack)
- **Log aggregation** for distributed systems
- **Real-time monitoring** and alerting
- **Log retention policies** (30 days operational, 1 year compliance)

## Monitoring & Alerting

### Critical Alerts
- Error rate > 5% over 5 minutes
- Authentication failure rate > 10% over 1 minute
- Page load time > 5 seconds
- API response time > 2 seconds
- Memory usage > 80%

### Dashboards
- **Real-time metrics**: Error rates, response times, user activity
- **Performance trends**: Load times, API performance, user engagement
- **Security monitoring**: Failed logins, suspicious activity, rate limiting
- **Business metrics**: User registrations, media plays, playlist creation

## Privacy & Compliance

### Data Protection
- **PII redaction** in logs (email addresses, names)
- **Sensitive data exclusion** (passwords, tokens, credit cards)
- **GDPR compliance** with data retention and deletion
- **Access controls** for log viewing and analysis

### Security Considerations
- **Log tampering prevention** with checksums
- **Secure transmission** of logs to external services
- **Access auditing** for log access
- **Encryption at rest** for stored logs

---

This logging infrastructure provides comprehensive visibility into application behavior while maintaining security and privacy standards.
