#!/usr/bin/env node

/**
 * Script para probar la comunicación Kafka directamente
 */

import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-client',
  brokers: ['localhost:9092'],
});

async function testKafka() {
  console.log('🔍 Probando comunicación Kafka...\n');

  try {
    // Crear productor
    const producer = kafka.producer();
    await producer.connect();
    console.log('✅ Productor Kafka conectado');

    // Crear consumidor
    const consumer = kafka.consumer({ groupId: 'test-group' });
    await consumer.connect();
    console.log('✅ Consumidor Kafka conectado');

    // Suscribirse a los topics
    await consumer.subscribe({ topic: 'user-logs', fromBeginning: false });
    await consumer.subscribe({ topic: 'create-user-logs', fromBeginning: false });
    console.log('✅ Suscrito a topics');

    // Configurar el consumidor para recibir mensajes
    let messageReceived = false;
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`📨 Mensaje recibido en topic ${topic}:`, {
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
        messageReceived = true;
      },
    });

    // Enviar un mensaje de prueba
    console.log('\n📤 Enviando mensaje de prueba...');
    await producer.send({
      topic: 'user-logs',
      messages: [
        {
          value: JSON.stringify({
            service: 'TEST_SERVICE',
            action: 'TEST_ACTION',
            data: { test: true },
            level: 'INFO',
          }),
        },
      ],
    });
    console.log('✅ Mensaje enviado');

    // Esperar un poco para recibir el mensaje
    console.log('\n⏳ Esperando mensaje...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (messageReceived) {
      console.log('✅ Comunicación Kafka funcionando correctamente');
    } else {
      console.log('❌ No se recibió ningún mensaje');
    }

    // Limpiar
    await producer.disconnect();
    await consumer.disconnect();
    console.log('✅ Conexiones cerradas');

  } catch (error) {
    console.error('❌ Error probando Kafka:', error.message);
  }
}

testKafka();
