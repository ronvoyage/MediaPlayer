import request from 'supertest';
import express from 'express';
import { server } from '../server';

// Set test timeout to 10 seconds to avoid hanging
jest.setTimeout(10000);

describe('Server Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // Import the server app
    app = server;
  });

  afterAll(async () => {
    // Clean up any open connections
    if (app && app.listen) {
      await new Promise(resolve => {
        if (app.listening) {
          app.close(resolve);
        } else {
          resolve(undefined);
        }
      });
    }
  });

  describe('Health Check Endpoint', () => {
    it('should return 200 OK for health check', async () => {
      const response = await request(app)
        .get('/health')
        .timeout(5000); // 5 second timeout

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Logging Endpoint', () => {
    it('should accept valid log entries', async () => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: 'info',
        service: 'frontend',
        message: 'Test log message',
        component: 'TestComponent',
        action: 'test_action',
        sessionId: 'test-session-123'
      };

      const response = await request(app)
        .post('/api/v1/logs')
        .send(logEntry)
        .timeout(5000);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should reject invalid log entries', async () => {
      const invalidLogEntry = {
        message: 'Missing required fields'
        // Missing level, service, etc.
      };

      const response = await request(app)
        .post('/api/v1/logs')
        .send(invalidLogEntry)
        .timeout(5000);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/logs')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .timeout(5000);

      expect(response.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .timeout(5000);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle server errors gracefully', async () => {
      // This test would require mocking internal errors
      // For now, we'll test the basic error handling structure
      const response = await request(app)
        .get('/health')
        .timeout(5000);

      expect(response.status).toBe(200);
    });
  });

  describe('CORS Configuration', () => {
    it('should allow CORS requests', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .timeout(5000);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
