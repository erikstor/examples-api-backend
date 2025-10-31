import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggingService } from './logging.service';
import { KAFKA_TOPICS } from '@/shared/kafka/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-service-group',
          },
        },
      },
    ]),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
