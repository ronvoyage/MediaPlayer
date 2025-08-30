"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoggingConfig = exports.getLoggingConfig = void 0;
const getLoggingConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    const baseConfig = {
        level: process.env.LOG_LEVEL || 'info',
        enableConsole: true,
        enableFile: true,
        enableRotation: true,
        maxFileSize: '20m',
        maxFiles: '30d',
        logDirectory: 'logs',
        retentionDays: {
            error: 14,
            combined: 30,
            security: 90,
            exceptions: 30,
            rejections: 30
        },
        enableCompression: true,
        enableSecurityLogging: true,
        enablePerformanceLogging: true,
        enableUserActionLogging: true,
        enableExternalMonitoring: false,
        externalMonitoringUrl: process.env.EXTERNAL_MONITORING_URL,
        externalMonitoringApiKey: process.env.EXTERNAL_MONITORING_API_KEY
    };
    // Environment-specific overrides
    switch (env) {
        case 'development':
            return {
                ...baseConfig,
                level: 'debug',
                enableConsole: true,
                enableFile: true,
                enableRotation: false, // Simpler for development
                maxFiles: '7d',
                retentionDays: {
                    error: 7,
                    combined: 7,
                    security: 30,
                    exceptions: 7,
                    rejections: 7
                },
                enableCompression: false,
                enableExternalMonitoring: false
            };
        case 'test':
            return {
                ...baseConfig,
                level: 'warn',
                enableConsole: false,
                enableFile: false,
                enableRotation: false,
                enableSecurityLogging: false,
                enablePerformanceLogging: false,
                enableUserActionLogging: false,
                enableExternalMonitoring: false
            };
        case 'staging':
            return {
                ...baseConfig,
                level: 'info',
                enableConsole: true,
                enableFile: true,
                enableRotation: true,
                maxFiles: '14d',
                retentionDays: {
                    error: 14,
                    combined: 14,
                    security: 60,
                    exceptions: 14,
                    rejections: 14
                },
                enableExternalMonitoring: true
            };
        case 'production':
            return {
                ...baseConfig,
                level: 'warn',
                enableConsole: false,
                enableFile: true,
                enableRotation: true,
                maxFiles: '90d',
                retentionDays: {
                    error: 30,
                    combined: 90,
                    security: 365,
                    exceptions: 90,
                    rejections: 90
                },
                enableCompression: true,
                enableExternalMonitoring: true
            };
        default:
            return baseConfig;
    }
};
exports.getLoggingConfig = getLoggingConfig;
const validateLoggingConfig = (config) => {
    const errors = [];
    if (!['debug', 'info', 'warn', 'error', 'fatal'].includes(config.level)) {
        errors.push('Invalid log level. Must be one of: debug, info, warn, error, fatal');
    }
    if (config.maxFileSize && !/^\d+[kmg]?$/i.test(config.maxFileSize)) {
        errors.push('Invalid max file size format. Use format like: 20m, 1g, 100k');
    }
    if (config.maxFiles && !/^\d+[dm]?$/i.test(config.maxFiles)) {
        errors.push('Invalid max files format. Use format like: 30d, 7d, 12m');
    }
    if (config.enableExternalMonitoring && !config.externalMonitoringUrl) {
        errors.push('External monitoring URL is required when external monitoring is enabled');
    }
    if (config.enableExternalMonitoring && !config.externalMonitoringApiKey) {
        errors.push('External monitoring API key is required when external monitoring is enabled');
    }
    return errors;
};
exports.validateLoggingConfig = validateLoggingConfig;
//# sourceMappingURL=logging.js.map