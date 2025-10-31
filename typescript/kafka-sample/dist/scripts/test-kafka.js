#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'test-client',
    brokers: ['localhost:9092'],
});
async function testKafka() {
    console.log('🔍 Probando comunicación Kafka...\n');
    try {
        const producer = kafka.producer();
        await producer.connect();
        console.log('✅ Productor Kafka conectado');
        const consumer = kafka.consumer({ groupId: 'test-group' });
        await consumer.connect();
        console.log('✅ Consumidor Kafka conectado');
        await consumer.subscribe({ topic: 'user-logs', fromBeginning: false });
        await consumer.subscribe({ topic: 'create-user-logs', fromBeginning: false });
        console.log('✅ Suscrito a topics');
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
        console.log('\n⏳ Esperando mensaje...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (messageReceived) {
            console.log('✅ Comunicación Kafka funcionando correctamente');
        }
        else {
            console.log('❌ No se recibió ningún mensaje');
        }
        await producer.disconnect();
        await consumer.disconnect();
        console.log('✅ Conexiones cerradas');
    }
    catch (error) {
        console.error('❌ Error probando Kafka:', error.message);
    }
}
testKafka();
//# sourceMappingURL=test-kafka.js.map