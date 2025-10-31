#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'test-logging-consumer',
    brokers: ['localhost:9092'],
});
async function testLoggingService() {
    console.log('🔍 Probando recepción de mensajes en Logging Service...\n');
    try {
        const consumer = kafka.consumer({ groupId: 'test-logging-group' });
        await consumer.connect();
        console.log('✅ Consumidor conectado');
        await consumer.subscribe({ topic: 'user-logs', fromBeginning: false });
        await consumer.subscribe({ topic: 'create-user-logs', fromBeginning: false });
        console.log('✅ Suscrito a topics');
        let messageCount = 0;
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                messageCount++;
                const logMessage = JSON.parse(message.value?.toString() || '{}');
                console.log(`📨 [${topic}] Mensaje ${messageCount}:`, {
                    service: logMessage.service,
                    action: logMessage.action,
                    level: logMessage.level,
                });
            },
        });
        console.log('⏳ Esperando mensajes... (presiona Ctrl+C para salir)');
        process.on('SIGINT', async () => {
            console.log('\n🛑 Deteniendo consumidor...');
            await consumer.disconnect();
            console.log('✅ Consumidor desconectado');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
}
testLoggingService();
//# sourceMappingURL=test-logging-consumer.js.map