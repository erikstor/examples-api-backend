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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@/shared/kafka/config");
let LoggingService = class LoggingService {
    constructor(kafkaClient) {
        this.kafkaClient = kafkaClient;
    }
    async logAction(service, action, data, level = 'INFO') {
        const logMessage = {
            service,
            action,
            data,
            level,
        };
        try {
            await this.kafkaClient.emit(config_1.KAFKA_TOPICS.USER_LOGS, logMessage);
            console.log(`[${service}] Log enviado: ${action} - ${level}`);
        }
        catch (error) {
            console.error(`Error enviando log: ${error.message}`);
        }
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KAFKA_CLIENT')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka])
], LoggingService);
//# sourceMappingURL=logging.service.js.map