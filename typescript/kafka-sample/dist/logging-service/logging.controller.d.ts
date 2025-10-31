import { LoggingService } from './logging.service';
import { LogMessageDto, LogResponse } from '../../shared/interfaces';
export declare class LoggingController {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    getAllLogs(): Promise<LogResponse[]>;
    getLogStats(): Promise<any>;
    getElasticsearchStats(): Promise<any>;
    searchLogs(query: string): Promise<any>;
    getLogsByService(serviceName: string): Promise<LogResponse[]>;
    getLogsByLevel(level: string): Promise<LogResponse[]>;
    handleUserLogs(logMessage: LogMessageDto): Promise<void>;
    handleCreateUserLogs(logMessage: LogMessageDto): Promise<void>;
}
