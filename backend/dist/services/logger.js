"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logging_1 = require("../config/logging");
class BackendLogger {
    constructor() {
        this.config = (0, logging_1.getLoggingConfig)();
        this.winston = winston_1.default.createLogger({
            level: this.config.level,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
            transports: this.createTransports()
        });
        // Add console transport for development
        if (this.config.enableConsole) {
            this.winston.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            }));
        }
        // Handle uncaught exceptions and unhandled rejections
        if (this.config.enableFile) {
            this.winston.exceptions.handle(new winston_1.default.transports.DailyRotateFile({
                filename: `${this.config.logDirectory}/exceptions-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                maxSize: this.config.maxFileSize,
                maxFiles: this.config.maxFiles,
                zippedArchive: this.config.enableCompression
            }));
            this.winston.rejections.handle(new winston_1.default.transports.DailyRotateFile({
                filename: `${this.config.logDirectory}/rejections-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                maxSize: this.config.maxFileSize,
                maxFiles: this.config.maxFiles,
                zippedArchive: this.config.enableCompression
            }));
        }
    }
    createTransports() {
        const transports = [];
        if (this.config.enableFile) {
            if (this.config.enableRotation) {
                // Error logs with rotation
                transports.push(new winston_1.default.transports.DailyRotateFile({
                    filename: `${this.config.logDirectory}/error-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    maxSize: this.config.maxFileSize,
                    maxFiles: this.config.maxFiles,
                    zippedArchive: this.config.enableCompression
                }));
                // Combined logs with rotation
                transports.push(new winston_1.default.transports.DailyRotateFile({
                    filename: `${this.config.logDirectory}/combined-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    maxSize: this.config.maxFileSize,
                    maxFiles: this.config.maxFiles,
                    zippedArchive: this.config.enableCompression
                }));
                // Security logs with rotation
                if (this.config.enableSecurityLogging) {
                    transports.push(new winston_1.default.transports.DailyRotateFile({
                        filename: `${this.config.logDirectory}/security-%DATE%.log`,
                        datePattern: 'YYYY-MM-DD',
                        level: 'warn',
                        maxSize: this.config.maxFileSize,
                        maxFiles: this.config.maxFiles,
                        zippedArchive: this.config.enableCompression
                    }));
                }
            }
            else {
                // Simple file logging for development
                transports.push(new winston_1.default.transports.File({
                    filename: `${this.config.logDirectory}/error.log`,
                    level: 'error'
                }));
                transports.push(new winston_1.default.transports.File({
                    filename: `${this.config.logDirectory}/combined.log`
                }));
            }
        }
        return transports;
    }
    debug(message, options) {
        this.log('debug', message, options);
    }
    info(message, options) {
        this.log('info', message, options);
    }
    warn(message, options) {
        this.log('warn', message, options);
    }
    error(message, error, options) {
        this.log('error', message, {
            ...options,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack || '',
                code: error.code
            } : undefined
        });
    }
    fatal(message, error, options) {
        this.log('fatal', message, {
            ...options,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack || '',
                code: error.code
            } : undefined
        });
    }
    apiRequest(req, duration, statusCode) {
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
            requestId: req.headers['x-request-id']
        });
    }
    security(message, req, riskLevel) {
        if (!this.config.enableSecurityLogging)
            return;
        this.log('warn', message, {
            component: 'Security',
            action: 'security_event',
            security: {
                ip: req.ip || 'unknown',
                userAgent: req.get('User-Agent') || 'unknown',
                risk: riskLevel
            },
            requestId: req.headers['x-request-id']
        });
    }
    performance(operation, duration, metadata) {
        if (!this.config.enablePerformanceLogging)
            return;
        this.log('info', `Performance: ${operation}`, {
            component: 'Performance',
            action: 'performance_measurement',
            duration,
            metadata
        });
    }
    userAction(action, userId, metadata) {
        if (!this.config.enableUserActionLogging)
            return;
        this.log('info', `User Action: ${action}`, {
            component: 'User',
            action: 'user_action',
            userId,
            metadata
        });
    }
    log(level, message, options) {
        const logEntry = {
            service: 'backend',
            level,
            message,
            timestamp: new Date().toISOString(),
            ...options
        };
        this.winston.log(level, message, logEntry);
        // Send to external monitoring if enabled
        if (this.config.enableExternalMonitoring && (level === 'error' || level === 'fatal')) {
            this.sendToExternalMonitoring(logEntry);
        }
    }
    async sendToExternalMonitoring(logEntry) {
        try {
            if (this.config.externalMonitoringUrl && this.config.externalMonitoringApiKey) {
                await fetch(this.config.externalMonitoringUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.config.externalMonitoringApiKey}`
                    },
                    body: JSON.stringify(logEntry)
                });
            }
        }
        catch (error) {
            // Don't let external monitoring failures break logging
            this.winston.warn('Failed to send to external monitoring', { error: error instanceof Error ? error.message : String(error) });
        }
    }
    // Method to update configuration at runtime
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Update log level
        this.winston.level = this.config.level;
        // Log configuration change
        this.info('Logging configuration updated', {
            component: 'Logger',
            action: 'config_updated',
            metadata: { newConfig: this.config }
        });
    }
    // Method to get current configuration
    getConfig() {
        return { ...this.config };
    }
}
exports.logger = new BackendLogger();
//# sourceMappingURL=logger.js.map