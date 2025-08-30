"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Backend test setup with proper timeouts and mocks
const globals_1 = require("@jest/globals");
// Set global test timeout
globals_1.jest.setTimeout(10000);
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
    console.log = globals_1.jest.fn();
    console.info = globals_1.jest.fn();
    console.debug = globals_1.jest.fn();
    console.warn = globals_1.jest.fn();
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
globals_1.jest.mock('../services/logger', () => ({
    logger: {
        debug: globals_1.jest.fn(),
        info: globals_1.jest.fn(),
        warn: globals_1.jest.fn(),
        error: globals_1.jest.fn(),
        fatal: globals_1.jest.fn(),
        apiRequest: globals_1.jest.fn(),
        security: globals_1.jest.fn(),
        performance: globals_1.jest.fn(),
        userAction: globals_1.jest.fn()
    }
}));
// Global test utilities
global.testUtils = {
    // Helper to wait for async operations with timeout
    waitFor: async (condition, timeout = 5000) => {
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
        get: globals_1.jest.fn((header) => {
            if (header === 'User-Agent')
                return 'Jest-Test-Agent';
            if (header === 'x-request-id')
                return 'test-request-123';
            return undefined;
        }),
        headers: {},
        body: {},
        ...overrides
    }),
    // Helper to create mock response objects
    createMockResponse: () => {
        const res = {};
        res.status = globals_1.jest.fn().mockReturnValue(res);
        res.json = globals_1.jest.fn().mockReturnValue(res);
        res.send = globals_1.jest.fn().mockReturnValue(res);
        res.set = globals_1.jest.fn().mockReturnValue(res);
        res.headers = {};
        return res;
    }
};
//# sourceMappingURL=setup.js.map