import { jest } from '@jest/globals';
import { logger } from '../services/logger';

// Set test timeout to 5 seconds
jest.setTimeout(5000);

// Mock winston to avoid file system operations during tests
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
    level: 'info',
    add: jest.fn(),
    exceptions: { handle: jest.fn() },
    rejections: { handle: jest.fn() }
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn()
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
    DailyRotateFile: jest.fn()
  }
}));

describe('Logger Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Logging Methods', () => {
    it('should call debug method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      logger.debug('Test debug message');
      
      expect(mockLog).toHaveBeenCalledWith('debug', 'Test debug message', undefined);
    });

    it('should call info method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      logger.info('Test info message');
      
      expect(mockLog).toHaveBeenCalledWith('info', 'Test info message', undefined);
    });

    it('should call warn method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      logger.warn('Test warn message');
      
      expect(mockLog).toHaveBeenCalledWith('warn', 'Test warn message', undefined);
    });

    it('should call error method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      const testError = new Error('Test error');
      logger.error('Test error message', testError);
      
      expect(mockLog).toHaveBeenCalledWith('error', 'Test error message', {
        error: {
          name: 'Error',
          message: 'Test error',
          stack: testError.stack,
          code: undefined
        }
      });
    });

    it('should call fatal method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      const testError = new Error('Test fatal error');
      logger.fatal('Test fatal message', testError);
      
      expect(mockLog).toHaveBeenCalledWith('fatal', 'Test fatal message', {
        error: {
          name: 'Error',
          message: 'Test fatal error',
          stack: testError.stack,
          code: undefined
        }
      });
    });
  });

  describe('Specialized Logging Methods', () => {
    it('should call apiRequest method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        get: jest.fn((header: string) => {
          if (header === 'User-Agent') return 'Test-Agent';
          if (header === 'x-request-id') return 'test-123';
          return undefined;
        }),
        headers: {}
      };
      
      logger.apiRequest(mockReq as any, 150, 200);
      
      expect(mockLog).toHaveBeenCalledWith('info', 'API Request: GET /test', {
        component: 'API',
        action: 'request',
        duration: 150,
        metadata: {
          method: 'GET',
          path: '/test',
          statusCode: 200,
          userAgent: 'Test-Agent',
          ip: '127.0.0.1'
        },
        requestId: 'test-123'
      });
    });

    it('should call security method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      const mockReq = {
        ip: '192.168.1.1',
        get: jest.fn((header: string) => 'Test-Agent'),
        headers: { 'x-request-id': 'sec-123' }
      };
      
      logger.security('Test security event', mockReq as any, 'medium');
      
      expect(mockLog).toHaveBeenCalledWith('warn', 'Test security event', {
        component: 'Security',
        action: 'security_event',
        security: {
          ip: '192.168.1.1',
          userAgent: 'Test-Agent',
          risk: 'medium'
        },
        requestId: 'sec-123'
      });
    });

    it('should call performance method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      logger.performance('Test operation', 250, { detail: 'test' });
      
      expect(mockLog).toHaveBeenCalledWith('info', 'Performance: Test operation', {
        component: 'Performance',
        action: 'performance_measurement',
        duration: 250,
        metadata: { detail: 'test' }
      });
    });

    it('should call userAction method', () => {
      const mockLog = jest.fn();
      (logger as any).winston = { log: mockLog };
      
      logger.userAction('test_action', 'user123', { detail: 'test' });
      
      expect(mockLog).toHaveBeenCalledWith('info', 'User Action: test_action', {
        component: 'User',
        action: 'user_action',
        userId: 'user123',
        metadata: { detail: 'test' }
      });
    });
  });

  describe('Configuration Methods', () => {
    it('should get current configuration', () => {
      const config = logger.getConfig();
      
      expect(config).toBeDefined();
      expect(config).toHaveProperty('level');
      expect(config).toHaveProperty('enableConsole');
      expect(config).toHaveProperty('enableFile');
    });

    it('should update configuration', () => {
      const originalConfig = logger.getConfig();
      const newLevel = 'debug';
      
      logger.updateConfig({ level: newLevel });
      
      const updatedConfig = logger.getConfig();
      expect(updatedConfig.level).toBe(newLevel);
      
      // Restore original config
      logger.updateConfig({ level: originalConfig.level });
    });
  });
});
