"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./services/logger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3201;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:3200", "http://localhost:3201"]
        }
    }
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3200',
    credentials: true
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// HTTP request logging
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => {
            logger_1.logger.info(message.trim(), { component: 'HTTP' });
        }
    }
}));
// Request ID middleware
app.use((req, res, next) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] ||
        Math.random().toString(36).substring(2, 15);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    logger_1.logger.info('Health check requested', { component: 'Health' });
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'MediaPlayer Backend'
    });
});
// Log endpoint for frontend logs
app.post('/api/v1/logs', (req, res) => {
    try {
        const logEntry = req.body;
        logger_1.logger.info(`Frontend Log: ${logEntry.message}`, {
            component: 'Frontend',
            metadata: logEntry
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        logger_1.logger.error('Failed to process frontend log', error, {
            component: 'Logger'
        });
        res.status(500).json({ error: 'Failed to process log' });
    }
});
// Error handling middleware
app.use((error, req, res, next) => {
    logger_1.logger.error('Unhandled API Error', error, {
        component: 'API',
        requestId: req.headers['x-request-id'],
        metadata: {
            method: req.method,
            path: req.path,
            body: req.body
        }
    });
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
// 404 handler
app.use('*', (req, res) => {
    logger_1.logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
        component: 'API',
        action: '404'
    });
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`MediaPlayer Backend server running on port ${PORT}`, {
        component: 'Server',
        action: 'startup',
        metadata: {
            port: PORT,
            env: process.env.NODE_ENV || 'development'
        }
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map