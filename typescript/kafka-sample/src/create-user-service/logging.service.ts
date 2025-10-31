import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from '@/shared/kafka/config';
import { LogMessageDto } from '@/shared/dto';

@Injectable()
export class LoggingService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async logAction(
    service: string,
    action: string,
    data: any,
    level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' = 'INFO',
  ): Promise<void> {
    const logMessage: LogMessageDto = {
      service,
      action,
      data,
      level,
    };

    try {
      await this.kafkaClient.emit(KAFKA_TOPICS.CREATE_USER_LOGS, logMessage);
      console.log(`[${service}] Log enviado: ${action} - ${level}`);
    } catch (error) {
      console.error(`Error enviando log: ${error.message}`);
    }
  }
}
