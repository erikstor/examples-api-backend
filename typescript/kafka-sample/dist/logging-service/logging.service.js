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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_service_1 = require("../../shared/services/elasticsearch.service");
const uuid_1 = require("uuid");
let LoggingService = class LoggingService {
    constructor(elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
        this.logs = [];
    }
    async storeLog(logMessage) {
        const logEntry = {
            id: (0, uuid_1.v4)(),
            service: logMessage.service,
            action: logMessage.action,
            timestamp: new Date(),
            data: logMessage.data,
            level: logMessage.level,
        };
        this.logs.push(logEntry);
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(-1000);
        }
        try {
            await this.elasticsearchService.indexLog({
                id: logEntry.id,
                service: logEntry.service,
                action: logEntry.action,
                timestamp: logEntry.timestamp,
                level: logEntry.level,
                data: logEntry.data,
                message: `${logEntry.service}: ${logEntry.action}`,
            });
        }
        catch (error) {
            console.error('Error enviando log a Elasticsearch:', error.message);
        }
        console.log(`✅ Log almacenado: [${logEntry.service}] ${logEntry.action} - ${logEntry.level}`);
    }
    async getAllLogs() {
        return this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async getLogStats() {
        const stats = {
            totalLogs: this.logs.length,
            logsByService: {},
            logsByLevel: {},
            recentLogs: this.logs.slice(-10),
        };
        this.logs.forEach(log => {
            stats.logsByService[log.service] = (stats.logsByService[log.service] || 0) + 1;
            stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1;
        });
        return stats;
    }
    async getElasticsearchStats() {
        try {
            return await this.elasticsearchService.getLogStats();
        }
        catch (error) {
            console.error('Error obteniendo estadísticas de Elasticsearch:', error.message);
            return { error: 'No se pudieron obtener estadísticas de Elasticsearch' };
        }
    }
    async searchLogsInElasticsearch(query) {
        try {
            return await this.elasticsearchService.searchLogs(query);
        }
        catch (error) {
            console.error('Error buscando logs en Elasticsearch:', error.message);
            throw error;
        }
    }
    async getLogsByService(service) {
        return this.logs
            .filter(log => log.service === service)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async getLogsByLevel(level) {
        return this.logs
            .filter(log => log.level === level)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof elasticsearch_service_1.ElasticsearchService !== "undefined" && elasticsearch_service_1.ElasticsearchService) === "function" ? _a : Object])
], LoggingService);
//# sourceMappingURL=logging.service.js.map