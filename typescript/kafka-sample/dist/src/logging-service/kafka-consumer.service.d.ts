import { OnModuleInit } from '@nestjs/common';
import { LoggingService } from './logging.service';
export declare class KafkaConsumerService implements OnModuleInit {
    private readonly loggingService;
    private consumer;
    constructor(loggingService: LoggingService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
