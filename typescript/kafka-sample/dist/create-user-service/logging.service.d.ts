import { ClientKafka } from '@nestjs/microservices';
export declare class LoggingService {
    private readonly kafkaClient;
    constructor(kafkaClient: ClientKafka);
    logAction(service: string, action: string, data: any, level?: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'): Promise<void>;
}
