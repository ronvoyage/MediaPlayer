import express from 'express';
import cors from 'cors';
import { logger } from './services/logger';
import type { LogEntry } from './types/logging';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.apiRequest(req, duration, res.statusCode);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Logging endpoint
app.post('/api/v1/logs', (req, res) => {
  try {
    const logEntry: LogEntry = req.body;
    
    // Validate log entry
    if (!logEntry.message || !logEntry.level || !logEntry.service) {
      return res.status(400).json({ error: 'Invalid log entry' });
    }

    // Log to backend logger
    switch (logEntry.level) {
      case 'debug':
        logger.debug(logEntry.message, {
          component: logEntry.component,
          action: logEntry.action,
          metadata: logEntry.metadata,
          error: logEntry.error,
          duration: logEntry.duration,
          performance: logEntry.performance,
          security: logEntry.security
        });
        break;
      case 'info':
        logger.info(logEntry.message, {
          component: logEntry.component,
          action: logEntry.action,
          metadata: logEntry.metadata,
          duration: logEntry.duration,
          performance: logEntry.performance
        });
        break;
      case 'warn':
        logger.warn(logEntry.message, {
          component: logEntry.component,
          action: logEntry.action,
          metadata: logEntry.metadata,
          security: logEntry.security
        });
        break;
      case 'error':
        logger.error(logEntry.message, logEntry.error ? new Error(logEntry.error.message) : undefined, {
          component: logEntry.component,
          action: logEntry.action,
          metadata: logEntry.metadata
        });
        break;
      case 'fatal':
        logger.fatal(logEntry.message, logEntry.error ? new Error(logEntry.error.message) : undefined, {
          component: logEntry.component,
          action: logEntry.action,
          metadata: logEntry.metadata
        });
        break;
      default:
        logger.warn(`Unknown log level: ${logEntry.level}`, {
          component: 'API',
          action: 'unknown_log_level',
          metadata: { receivedLevel: logEntry.level }
        });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Failed to process log entry', error as Error, {
      component: 'API',
      action: 'log_processing_error',
      metadata: { body: req.body }
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err, {
    component: 'API',
    action: 'unhandled_error',
    metadata: {
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', {
    component: 'API',
    action: 'route_not_found',
    metadata: {
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });
  
  res.status(404).json({ error: 'Route not found' });
});

// Export for testing
export { app as server };

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Backend server running on port ${PORT}`, {
      component: 'Server',
      action: 'server_started',
      metadata: { port: PORT, environment: process.env.NODE_ENV || 'development' }
    });
  });
}

