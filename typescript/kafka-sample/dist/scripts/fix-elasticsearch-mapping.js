#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const client = new elasticsearch_1.Client({
    node: 'http://localhost:9200'
});
async function recreateIndex() {
    console.log('🔄 Recreando índice de Elasticsearch...\n');
    try {
        const today = new Date().toISOString().split('T')[0];
        const indexName = `microservices-logs-${today}`;
        console.log(`📋 Índice objetivo: ${indexName}`);
        const exists = await client.indices.exists({ index: indexName });
        if (exists) {
            console.log('🗑️ Eliminando índice existente...');
            await client.indices.delete({ index: indexName });
            console.log('✅ Índice eliminado');
        }
        console.log('🔨 Creando índice con mapeo correcto...');
        await client.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        service: { type: 'keyword' },
                        action: { type: 'keyword' },
                        timestamp: { type: 'date' },
                        level: { type: 'keyword' },
                        data: {
                            type: 'object',
                            properties: {
                                userId: { type: 'keyword' },
                                user: { type: 'object' },
                                userData: { type: 'object' },
                                error: { type: 'text' },
                                timestamp: { type: 'date' }
                            }
                        },
                        message: { type: 'text' },
                    },
                },
            },
        });
        console.log('✅ Índice creado exitosamente con mapeo correcto');
        console.log('\n📊 Verificando índice...');
        const mapping = await client.indices.getMapping({ index: indexName });
        console.log('Mapeo del índice:', JSON.stringify(mapping[indexName].mappings.properties.data, null, 2));
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
}
recreateIndex();
//# sourceMappingURL=fix-elasticsearch-mapping.js.map