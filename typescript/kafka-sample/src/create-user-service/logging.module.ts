import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggingService } from './logging.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'create-user-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'create-user-service-group',
          },
        },
      },
    ]),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
