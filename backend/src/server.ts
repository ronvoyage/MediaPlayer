import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './services/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());

// HTTP request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim(), { component: 'http' });
    }
  }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check requested', { 
    component: 'health',
    metadata: { ip: req.ip, userAgent: req.get('User-Agent') }
  });
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'MediaPlayer API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed', { 
    component: 'api',
    metadata: { ip: req.ip }
  });
  res.json({ 
    message: 'MediaPlayer API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      logs: '/api/logs'
    }
  });
});

// Logging endpoint for frontend
app.post('/api/logs', (req, res) => {
  const { level, message, metadata } = req.body;
  
  try {
    switch (level) {
      case 'error':
        logger.error(message, metadata);
        break;
      case 'warn':
        logger.warn(message, metadata);
        break;
      case 'info':
        logger.info(message, metadata);
        break;
      default:
        logger.info(message, metadata);
    }
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing log request', error instanceof Error ? error : new Error('Unknown error'), {
      component: 'api'
    });
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err, {
    component: 'api',
    metadata: {
      url: req.url,
      method: req.method
    }
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('404 - Route not found', { 
    component: 'api',
    metadata: {
      url: req.url, 
      method: req.method,
      ip: req.ip
    }
  });
  
  res.status(404).json({ 
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`MediaPlayer API server started`, { 
    component: 'server',
    metadata: {
      port: PORT, 
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

export default app;
