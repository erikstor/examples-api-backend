"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@elastic/elasticsearch");
let ElasticsearchService = class ElasticsearchService {
    async onModuleInit() {
        this.client = new elasticsearch_1.Client({
            node: 'http://localhost:9200',
        });
        try {
            const health = await this.client.cluster.health();
            console.log('✅ Elasticsearch conectado:', health.status);
            await this.createIndexIfNotExists();
        }
        catch (error) {
            console.error('❌ Error conectando a Elasticsearch:', error.message);
        }
    }
    async createIndexIfNotExists() {
        const indexName = 'microservices-logs';
        try {
            const exists = await this.client.indices.exists({ index: indexName });
            if (!exists) {
                await this.client.indices.create({
                    index: indexName,
                    body: {
                        mappings: {
                            properties: {
                                id: { type: 'keyword' },
                                service: { type: 'keyword' },
                                action: { type: 'keyword' },
                                timestamp: { type: 'date' },
                                level: { type: 'keyword' },
                                data: { type: 'object' },
                                message: { type: 'text' },
                            },
                        },
                    },
                });
                console.log(`✅ Índice ${indexName} creado exitosamente`);
            }
        }
        catch (error) {
            console.error('Error creando índice:', error.message);
        }
    }
    async indexLog(logData) {
        try {
            await this.client.index({
                index: 'microservices-logs',
                body: {
                    ...logData,
                    timestamp: new Date(),
                },
            });
            console.log('📊 Log indexado en Elasticsearch');
        }
        catch (error) {
            console.error('Error indexando log:', error.message);
        }
    }
    async searchLogs(query) {
        try {
            const response = await this.client.search({
                index: 'microservices-logs',
                body: query,
            });
            return response.body;
        }
        catch (error) {
            console.error('Error buscando logs:', error.message);
            throw error;
        }
    }
    async getLogStats() {
        try {
            const response = await this.client.search({
                index: 'microservices-logs',
                body: {
                    size: 0,
                    aggs: {
                        services: {
                            terms: { field: 'service' },
                        },
                        levels: {
                            terms: { field: 'level' },
                        },
                        timeline: {
                            date_histogram: {
                                field: 'timestamp',
                                calendar_interval: 'hour',
                            },
                        },
                    },
                },
            });
            return response.body;
        }
        catch (error) {
            console.error('Error obteniendo estadísticas:', error.message);
            throw error;
        }
    }
};
exports.ElasticsearchService = ElasticsearchService;
exports.ElasticsearchService = ElasticsearchService = __decorate([
    (0, common_1.Injectable)()
], ElasticsearchService);
//# sourceMappingURL=elasticsearch.service.js.map