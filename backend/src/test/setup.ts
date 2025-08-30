// Backend test setup with proper timeouts and mocks
import { jest } from '@jest/globals';

// Set global test timeout
jest.setTimeout(10000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Only log errors during tests

// Mock console methods to reduce noise during tests
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

beforeAll(() => {
  // Suppress console output during tests unless there's an error
  console.log = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
  console.warn = jest.fn();
  // Keep error logging for debugging test failures
  console.error = originalConsole.error;
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
});

// Mock winston logger to prevent file system operations during tests
jest.mock('../services/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    apiRequest: jest.fn(),
    security: jest.fn(),
    performance: jest.fn(),
    userAction: jest.fn()
  }
}));

// Global test utilities
(global as any).testUtils = {
  // Helper to wait for async operations with timeout
  waitFor: async (condition: () => boolean, timeout = 5000) => {
    const start = Date.now();
    while (!condition() && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!condition()) {
      throw new Error(`Condition not met within ${timeout}ms`);
    }
  },

  // Helper to create mock request objects
  createMockRequest: (overrides = {}) => ({
    method: 'GET',
    path: '/test',
    ip: '127.0.0.1',
    get: jest.fn((header: string) => {
      if (header === 'User-Agent') return 'Jest-Test-Agent';
      if (header === 'x-request-id') return 'test-request-123';
      return undefined;
    }),
    headers: {},
    body: {},
    ...overrides
  }),

  // Helper to create mock response objects
  createMockResponse: () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    res.headers = {};
    return res;
  }
};
