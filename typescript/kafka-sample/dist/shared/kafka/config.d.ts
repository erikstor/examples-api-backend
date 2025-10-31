import { KafkaOptions } from '@nestjs/microservices';
export declare const kafkaConfig: KafkaOptions;
export declare const KAFKA_TOPICS: {
    readonly USER_LOGS: "user-logs";
    readonly CREATE_USER_LOGS: "create-user-logs";
    readonly LOGGING_SERVICE: "logging-service";
};
