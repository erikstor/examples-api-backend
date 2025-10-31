import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
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

export const KAFKA_TOPICS = {
  USER_LOGS: 'user-logs',
  CREATE_USER_LOGS: 'create-user-logs',
  LOGGING_SERVICE: 'logging-service',
} as const;
