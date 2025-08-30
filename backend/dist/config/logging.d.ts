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
export declare const getLoggingConfig: () => LoggingConfig;
export declare const validateLoggingConfig: (config: LoggingConfig) => string[];
//# sourceMappingURL=logging.d.ts.map