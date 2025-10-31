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
exports.LoggingController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const logging_service_1 = require("./logging.service");
const dto_1 = require("@/shared/dto");
let LoggingController = class LoggingController {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    async getAllLogs() {
        return this.loggingService.getAllLogs();
    }
    async getLogStats() {
        return this.loggingService.getLogStats();
    }
    async getElasticsearchStats() {
        return this.loggingService.getElasticsearchStats();
    }
    async searchLogs(query) {
        if (!query) {
            return { error: 'Parámetro de búsqueda requerido' };
        }
        const searchQuery = {
            query: {
                multi_match: {
                    query: query,
                    fields: ['service', 'action', 'message', 'level'],
                },
            },
            sort: [
                { timestamp: { order: 'desc' } }
            ],
            size: 100,
        };
        return this.loggingService.searchLogsInElasticsearch(searchQuery);
    }
    async getLogsByService(serviceName) {
        return this.loggingService.getLogsByService(serviceName);
    }
    async getLogsByLevel(level) {
        return this.loggingService.getLogsByLevel(level);
    }
    async handleUserLogs(logMessage) {
        console.log('📝 [LOGGING SERVICE] Recibido log del User Service:', logMessage);
        await this.loggingService.storeLog(logMessage);
    }
    async handleCreateUserLogs(logMessage) {
        console.log('📝 [LOGGING SERVICE] Recibido log del Create User Service:', logMessage);
        await this.loggingService.storeLog(logMessage);
    }
};
exports.LoggingController = LoggingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "getAllLogs", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "getLogStats", null);
__decorate([
    (0, common_1.Get)('elasticsearch-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "getElasticsearchStats", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "searchLogs", null);
__decorate([
    (0, common_1.Get)('service/:serviceName'),
    __param(0, (0, common_1.Query)('serviceName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "getLogsByService", null);
__decorate([
    (0, common_1.Get)('level/:level'),
    __param(0, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "getLogsByLevel", null);
__decorate([
    (0, microservices_1.MessagePattern)('user-logs'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogMessageDto]),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "handleUserLogs", null);
__decorate([
    (0, microservices_1.MessagePattern)('create-user-logs'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogMessageDto]),
    __metadata("design:returntype", Promise)
], LoggingController.prototype, "handleCreateUserLogs", null);
exports.LoggingController = LoggingController = __decorate([
    (0, common_1.Controller)('logs'),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], LoggingController);
//# sourceMappingURL=logging.controller.js.map