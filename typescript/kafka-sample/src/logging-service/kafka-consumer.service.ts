import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { LoggingService } from './logging.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly loggingService: LoggingService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'logging-service-consumer',
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'logging-service-group' });
    
    await this.consumer.connect();
    console.log('✅ Kafka Consumer conectado');

    // Suscribirse a los topics
    await this.consumer.subscribe({ 
      topic: 'user-logs', 
      fromBeginning: false 
    });
    await this.consumer.subscribe({ 
      topic: 'create-user-logs', 
      fromBeginning: false 
    });
    
    console.log('✅ Suscrito a topics: user-logs, create-user-logs');

    // Configurar el consumidor para procesar mensajes
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          const logMessage = JSON.parse(message.value?.toString() || '{}');
          console.log(`📨 [${topic}] Mensaje recibido:`, logMessage);
          
          // Procesar el mensaje y enviarlo al LoggingService
          await this.loggingService.storeLog(logMessage);
        } catch (error) {
          console.error('Error procesando mensaje:', error);
        }
      },
    });
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
