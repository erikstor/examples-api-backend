"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
const logging_service_1 = require("./logging.service");
let KafkaConsumerService = class KafkaConsumerService {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    async onModuleInit() {
        const kafka = new kafkajs_1.Kafka({
            clientId: 'logging-service-consumer',
            brokers: ['localhost:9092'],
        });
        this.consumer = kafka.consumer({ groupId: 'logging-service-group' });
        await this.consumer.connect();
        console.log('✅ Kafka Consumer conectado');
        await this.consumer.subscribe({
            topic: 'user-logs',
            fromBeginning: false
        });
        await this.consumer.subscribe({
            topic: 'create-user-logs',
            fromBeginning: false
        });
        console.log('✅ Suscrito a topics: user-logs, create-user-logs');
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const logMessage = JSON.parse(message.value?.toString() || '{}');
                    console.log(`📨 [${topic}] Mensaje recibido:`, logMessage);
                    await this.loggingService.storeLog(logMessage);
                }
                catch (error) {
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
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map