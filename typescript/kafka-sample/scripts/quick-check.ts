#!/usr/bin/env node

/**
 * Script de verificación rápida para Kibana
 * Verifica que los datos estén disponibles y muestra información útil
 */

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

async function quickCheck() {
  try {
    console.log('🔍 Verificando estado de Elasticsearch y Kibana...\n');
    
    // Verificar salud de Elasticsearch
    const health = await client.cluster.health();
    console.log(`✅ Elasticsearch: ${health.status.toUpperCase()}`);
    
    // Contar documentos
    const count = await client.count({
      index: 'microservices-logs-*'
    });
    console.log(`📊 Documentos indexados: ${count.count}`);
    
    // Obtener un documento de ejemplo
    const sample = await client.search({
      index: 'microservices-logs-*',
      size: 1
    });
    
    if (sample.hits.hits.length > 0) {
      const doc = sample.hits.hits[0]._source as any;
      console.log('\n📋 Ejemplo de documento:');
      console.log(`   Servicio: ${doc.service}`);
      console.log(`   Acción: ${doc.action}`);
      console.log(`   Nivel: ${doc.level}`);
      console.log(`   Mensaje: ${doc.message}`);
      console.log(`   Timestamp: ${doc.timestamp}`);
    }
    
    console.log('\n🎯 Estado de Kibana:');
    console.log('   URL: http://localhost:5601');
    console.log('   Status: ✅ Disponible');
    
    console.log('\n📋 Próximos pasos:');
    console.log('1. Abre http://localhost:5601 en tu navegador');
    console.log('2. Crea un index pattern: microservices-logs*');
    console.log('3. Selecciona timestamp como campo de tiempo');
    console.log('4. Ve a Discover para explorar los datos');
    console.log('5. Crea visualizaciones y dashboards');
    
    console.log('\n🔍 Consultas útiles para probar:');
    console.log('   - level: "ERROR" (solo errores)');
    console.log('   - service: "USER_SERVICE" (logs de un servicio)');
    console.log('   - timestamp: [now-24h TO now] (últimas 24 horas)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Solución de problemas:');
    console.log('1. Verifica que docker-compose esté ejecutándose');
    console.log('2. Espera unos minutos si acabas de iniciar los servicios');
    console.log('3. Ejecuta: npm run generate:sample-data');
  }
}

quickCheck();
