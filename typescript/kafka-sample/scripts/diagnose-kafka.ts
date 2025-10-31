#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de comunicación Kafka
 */

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

async function diagnoseKafka() {
  console.log('🔍 Diagnóstico de Kafka y Elasticsearch...\n');

  try {
    // 1. Verificar Elasticsearch
    console.log('1. Verificando Elasticsearch...');
    const health = await client.cluster.health();
    console.log('✅ Elasticsearch conectado:', health.status);
    
    // 2. Verificar índices
    console.log('\n2. Verificando índices...');
    const indices = await client.cat.indices({ format: 'json' });
    console.log('Índices disponibles:');
    indices.forEach(index => {
      console.log(`  - ${index.index}: ${index['docs.count']} documentos`);
    });

    // 3. Verificar datos en microservices-logs
    console.log('\n3. Verificando datos en microservices-logs...');
    try {
      const searchResult = await client.search({
        index: 'microservices-logs',
        body: {
          query: { match_all: {} },
          size: 5
        }
      });
      console.log(`📊 Documentos en microservices-logs: ${searchResult.hits.total}`);
      if (searchResult.hits.hits.length > 0) {
        console.log('Ejemplos de documentos:');
        searchResult.hits.hits.forEach((hit: any, index: number) => {
          console.log(`  ${index + 1}. ${hit._source.service}: ${hit._source.action}`);
        });
      }
    } catch (error) {
      console.log('❌ Error buscando en microservices-logs:', error.message);
    }

    // 4. Verificar datos en índices con fecha
    console.log('\n4. Verificando datos en índices con fecha...');
    try {
      const searchResult = await client.search({
        index: 'microservices-logs-*',
        body: {
          query: { match_all: {} },
          size: 5
        }
      });
      console.log(`📊 Documentos en microservices-logs-*: ${searchResult.hits.total}`);
      if (searchResult.hits.hits.length > 0) {
        console.log('Ejemplos de documentos:');
        searchResult.hits.hits.forEach((hit: any, index: number) => {
          console.log(`  ${index + 1}. ${hit._source.service}: ${hit._source.action}`);
        });
      }
    } catch (error) {
      console.log('❌ Error buscando en microservices-logs-*:', error.message);
    }

    console.log('\n📋 Recomendaciones:');
    console.log('1. Verifica que los microservicios estén ejecutándose');
    console.log('2. Verifica que Kafka esté funcionando correctamente');
    console.log('3. Revisa los logs de los microservicios para errores de Kafka');
    console.log('4. Asegúrate de que el Logging Service esté escuchando los topics correctos');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
  }
}

diagnoseKafka();
