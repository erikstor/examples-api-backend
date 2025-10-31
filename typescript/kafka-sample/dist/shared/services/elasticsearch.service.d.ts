import { OnModuleInit } from '@nestjs/common';
export declare class ElasticsearchService implements OnModuleInit {
    private client;
    onModuleInit(): Promise<void>;
    private createIndexIfNotExists;
    indexLog(logData: any): Promise<void>;
    searchLogs(query: any): Promise<any>;
    getLogStats(): Promise<any>;
}
