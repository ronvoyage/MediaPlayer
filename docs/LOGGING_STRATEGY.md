# Logging Strategy & Infrastructure

## Overview

The MediaPlayer application implements a comprehensive logging strategy that provides structured logging, performance monitoring, error tracking, and security event logging across both frontend and backend services.

## Architecture

### Frontend Logging
- **Service**: `frontend/src/services/logger.ts`
- **Features**: Console logging, performance monitoring, error tracking, user action logging
- **Transport**: Console output (development) + HTTP to backend (production)

### Backend Logging
- **Service**: `backend/src/services/logger.ts`
- **Features**: File-based logging, log rotation, structured logging, external monitoring
- **Transport**: Winston with daily rotation, console (development), external services (production)

## Log Levels

| Level | Description | Usage |
|-------|-------------|-------|
| `debug` | Detailed debugging information | Development only, verbose troubleshooting |
| `info` | General information messages | Normal application flow, user actions |
| `warn` | Warning conditions | Non-critical issues, security events |
| `error` | Error conditions | Application errors, API failures |
| `fatal` | Critical system failures | Unrecoverable errors, system crashes |

## Frontend Logging Features

### Basic Logging
```typescript
import { logger } from '../services/logger';

logger.info('User logged in', { component: 'Auth', action: 'login' });
logger.error('API request failed', error, { component: 'API', action: 'fetch_data' });
```

### Performance Monitoring
```typescript
logger.performance('Component render', 150, { component: 'UserProfile' });
```

### User Action Tracking
```typescript
logger.userAction('button_click', 'ThemeToggle', { buttonId: 'dark_mode' });
```

### Security Monitoring
```typescript
logger.security('Suspicious rapid clicking detected', { clickCount: 25 });
```

### Error Threshold Monitoring
- Automatically tracks error frequency
- Alerts when threshold exceeded (configurable)
- Memory usage monitoring
- Performance degradation detection

## Backend Logging Features

### Structured Logging
```typescript
import { logger } from './services/logger';

logger.info('User authenticated', { 
  component: 'Auth', 
  action: 'authenticate',
  userId: 'user123',
  metadata: { method: 'jwt' }
});
```

### API Request Logging
```typescript
logger.apiRequest(req, duration, statusCode);
```

### Security Event Logging
```typescript
logger.security('Failed login attempt', req, 'medium');
```

### Performance Logging
```typescript
logger.performance('Database query', 45, { query: 'SELECT users' });
```

## Configuration

### Environment-Specific Settings

#### Development
- **Level**: `debug`
- **Console**: Enabled
- **File**: Simple files (no rotation)
- **Retention**: 7 days
- **Compression**: Disabled
- **External Monitoring**: Disabled

#### Test
- **Level**: `warn`
- **Console**: Disabled
- **File**: Disabled
- **Security/Performance**: Disabled

#### Staging
- **Level**: `info`
- **Console**: Enabled
- **File**: Rotated files
- **Retention**: 14 days
- **External Monitoring**: Enabled

#### Production
- **Level**: `warn`
- **Console**: Disabled
- **File**: Rotated files with compression
- **Retention**: 30-365 days
- **External Monitoring**: Enabled

### Configuration File
```typescript
// backend/src/config/logging.ts
export interface LoggingConfig {
  level: string;
  enableConsole: boolean;
  enableFile: boolean;
  enableRotation: boolean;
  maxFileSize: string;
  maxFiles: string;
  logDirectory: string;
  retentionDays: {
    error: number;
    combined: number;
    security: number;
    exceptions: number;
    rejections: number;
  };
  enableCompression: boolean;
  enableSecurityLogging: boolean;
  enablePerformanceLogging: boolean;
  enableUserActionLogging: boolean;
  enableExternalMonitoring: boolean;
  externalMonitoringUrl?: string;
  externalMonitoringApiKey?: string;
}
```

## Log Rotation & Retention

### File Structure
```
logs/
├── error-2024-01-15.log
├── combined-2024-01-15.log
├── security-2024-01-15.log
├── exceptions-2024-01-15.log
├── rejections-2024-01-15.log
└── archive/
    ├── error-2024-01-15.log.gz
    ├── combined-2024-01-15.log.gz
    └── ...
```

### Retention Policies
- **Error Logs**: 14-30 days (configurable)
- **Combined Logs**: 30-90 days (configurable)
- **Security Logs**: 90-365 days (configurable)
- **Exception Logs**: 30-90 days (configurable)
- **Rejection Logs**: 30-90 days (configurable)

## Development Tools

### Logging Dashboard
- **Component**: `frontend/src/components/LoggingDashboard.tsx`
- **Features**: Real-time log viewing, filtering, performance metrics, export
- **Access**: Bug icon in AppBar (development only)

### Log Analysis Utilities
- **Service**: `frontend/src/utils/logAnalysis.ts`
- **Features**: Pattern analysis, performance trending, error clustering, recommendations

## API Endpoints

### POST `/api/v1/logs`
Receives structured log entries from frontend.

**Request Body**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "service": "frontend",
  "message": "User action: button_click",
  "component": "ThemeToggle",
  "action": "button_click",
  "sessionId": "uuid",
  "userId": "user123",
  "metadata": { "buttonId": "dark_mode" }
}
```

**Response**:
```json
{
  "success": true
}
```

## External Monitoring Integration

### Supported Services
- Custom HTTP endpoints
- Bearer token authentication
- JSON payload format

### Configuration
```bash
EXTERNAL_MONITORING_URL=https://api.monitoring.com/logs
EXTERNAL_MONITORING_API_KEY=your_api_key_here
```

## Best Practices

### Frontend
1. **Component Identification**: Always specify component name
2. **Action Context**: Include action type for user interactions
3. **Metadata**: Add relevant context without sensitive data
4. **Error Handling**: Log errors with full context and stack traces
5. **Performance**: Track key user interactions and render times

### Backend
1. **Request Context**: Include request ID, user agent, IP address
2. **Security Events**: Log all authentication and authorization attempts
3. **Performance Metrics**: Track database queries, API response times
4. **Error Context**: Include request details with error logs
5. **Structured Data**: Use consistent metadata structure

### General
1. **No Sensitive Data**: Never log passwords, tokens, or PII
2. **Consistent Format**: Use standardized log entry structure
3. **Appropriate Levels**: Choose log level based on importance
4. **Performance Impact**: Minimize logging overhead in production
5. **Monitoring**: Set up alerts for critical error patterns

## Troubleshooting

### Common Issues

#### Frontend Logs Not Appearing
- Check browser console for errors
- Verify backend is running and accessible
- Check network tab for failed requests

#### Backend Log Files Not Created
- Verify `logs/` directory exists and is writable
- Check file permissions
- Verify logging configuration

#### Performance Impact
- Reduce log level in production
- Disable verbose logging features
- Use log sampling for high-volume operations

### Debug Mode
Enable debug logging by setting environment variable:
```bash
LOG_LEVEL=debug
```

## Future Enhancements

### Planned Features
- **Log Aggregation**: Centralized log collection service
- **Real-time Analytics**: Live log analysis and visualization
- **Machine Learning**: Automated error pattern detection
- **Integration**: Third-party monitoring service connectors
- **Compliance**: GDPR and data retention compliance tools

### Monitoring & Alerting
- **Error Rate Thresholds**: Configurable alerting rules
- **Performance Baselines**: Automatic degradation detection
- **Security Alerts**: Real-time threat detection
- **Capacity Planning**: Log volume trend analysis

## Compliance & Security

### Data Privacy
- No PII in logs
- Configurable retention periods
- Secure log storage
- Access control for log files

### Audit Trail
- Complete user action tracking
- Security event logging
- Performance monitoring
- Error tracking and resolution

### Data Retention
- Configurable retention policies
- Automatic log rotation
- Compressed archive storage
- Compliance with data protection regulations
