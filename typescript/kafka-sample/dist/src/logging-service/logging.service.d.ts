import { LogResponse } from '@/shared/interfaces';
import { LogMessageDto } from '@/shared/dto';
import { ElasticsearchService } from '@/shared/services/elasticsearch.service';
export declare class LoggingService {
    private readonly elasticsearchService;
    private logs;
    constructor(elasticsearchService: ElasticsearchService);
    storeLog(logMessage: LogMessageDto): Promise<void>;
    getAllLogs(): Promise<LogResponse[]>;
    getLogStats(): Promise<any>;
    getElasticsearchStats(): Promise<any>;
    searchLogsInElasticsearch(query: any): Promise<any>;
    getLogsByService(service: string): Promise<LogResponse[]>;
    getLogsByLevel(level: string): Promise<LogResponse[]>;
}
