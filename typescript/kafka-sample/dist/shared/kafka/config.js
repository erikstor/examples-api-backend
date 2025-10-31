"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KAFKA_TOPICS = exports.kafkaConfig = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.kafkaConfig = {
    transport: microservices_1.Transport.KAFKA,
    options: {
        client: {
            clientId: 'nestjs-microservices',
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: 'nestjs-consumer-group',
        },
    },
};
exports.KAFKA_TOPICS = {
    USER_LOGS: 'user-logs',
    CREATE_USER_LOGS: 'create-user-logs',
    LOGGING_SERVICE: 'logging-service',
};
//# sourceMappingURL=config.js.map