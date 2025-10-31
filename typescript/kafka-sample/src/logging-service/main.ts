import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { kafkaConfig } from '../shared/kafka/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar como microservicio Kafka
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);
  
  await app.startAllMicroservices();
  await app.listen(3003);
  
  console.log('Logging Service ejecutándose en puerto 3003');
  console.log('Microservicio Kafka configurado');
}

bootstrap();
