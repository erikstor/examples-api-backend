import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';
import { ElasticsearchService } from '../shared/services/elasticsearch.service';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'logging-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'logging-service-group',
          },
        },
      },
    ]),
  ],
  controllers: [LoggingController],
  providers: [LoggingService, ElasticsearchService, KafkaConsumerService],
})
export class AppModule {}
