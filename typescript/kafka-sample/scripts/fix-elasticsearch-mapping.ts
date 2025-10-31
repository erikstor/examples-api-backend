#!/usr/bin/env node

/**
 * Script para recrear el índice de Elasticsearch con el mapeo correcto
 */

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

async function recreateIndex() {
  console.log('🔄 Recreando índice de Elasticsearch...\n');

  try {
    const today = new Date().toISOString().split('T')[0];
    const indexName = `microservices-logs-${today}`;
    
    console.log(`📋 Índice objetivo: ${indexName}`);

    // Verificar si el índice existe
    const exists = await client.indices.exists({ index: indexName });
    
    if (exists) {
      console.log('🗑️ Eliminando índice existente...');
      await client.indices.delete({ index: indexName });
      console.log('✅ Índice eliminado');
    }

    // Crear el índice con el mapeo correcto
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

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

recreateIndex();
