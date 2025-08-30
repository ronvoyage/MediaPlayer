import 'winston-daily-rotate-file';
import { Request } from 'express';
import { BackendLogOptions } from '../types/logging';
declare class BackendLogger {
    private winston;
    private config;
    constructor();
    private createTransports;
    debug(message: string, options?: BackendLogOptions): void;
    info(message: string, options?: BackendLogOptions): void;
    warn(message: string, options?: BackendLogOptions): void;
    error(message: string, error?: Error, options?: BackendLogOptions): void;
    fatal(message: string, error?: Error, options?: BackendLogOptions): void;
    apiRequest(req: Request, duration: number, statusCode: number): void;
    security(message: string, req: Request, riskLevel: 'low' | 'medium' | 'high'): void;
    performance(operation: string, duration: number, metadata?: object): void;
    userAction(action: string, userId: string, metadata?: object): void;
    private log;
    private sendToExternalMonitoring;
    updateConfig(newConfig: Partial<typeof this.config>): void;
    getConfig(): typeof this.config;
}
export declare const logger: BackendLogger;
export {};
//# sourceMappingURL=logger.d.ts.map