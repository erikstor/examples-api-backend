#!/usr/bin/env node

/**
 * Script para generar datos de ejemplo en Elasticsearch
 * Este script simula logs de microservicios para poder crear reportes en Kibana
 */

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

// Datos de ejemplo para diferentes servicios
const sampleServices = [
  'USER_SERVICE',
  'CREATE_USER_SERVICE', 
  'LOGGING_SERVICE',
  'PAYMENT_SERVICE',
  'NOTIFICATION_SERVICE'
];

const sampleActions = [
  'CREATE_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'GET_USER',
  'SEND_EMAIL',
  'PROCESS_PAYMENT',
  'LOG_EVENT',
  'SEND_NOTIFICATION'
];

const sampleLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const sampleMessages = [
  'Usuario creado exitosamente',
  'Error al procesar petición',
  'Validación de datos completada',
  'Servicio iniciado correctamente',
  'Timeout en conexión a base de datos',
  'Email enviado exitosamente',
  'Pago procesado correctamente',
  'Notificación enviada',
  'Error de autenticación',
  'Datos actualizados'
];

// Función para generar un log aleatorio
function generateRandomLog() {
  const service = sampleServices[Math.floor(Math.random() * sampleServices.length)];
  const action = sampleActions[Math.floor(Math.random() * sampleActions.length)];
  const level = sampleLevels[Math.floor(Math.random() * sampleLevels.length)];
  const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  
  // Generar timestamp en las últimas 24 horas
  const now = new Date();
  const randomHours = Math.floor(Math.random() * 24);
  const timestamp = new Date(now.getTime() - (randomHours * 60 * 60 * 1000));
  
  return {
    timestamp: timestamp.toISOString(),
    service,
    action,
    level,
    message,
    data: {
      userId: Math.floor(Math.random() * 1000),
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      duration: Math.floor(Math.random() * 1000) + 100, // 100-1100ms
      statusCode: level === 'ERROR' ? 500 : 200
    },
    environment: 'development',
    version: '1.0.0'
  };
}

// Función principal
async function generateSampleData() {
  try {
    console.log('🚀 Iniciando generación de datos de ejemplo...');
    
    // Verificar conexión a Elasticsearch
    const health = await client.cluster.health();
    console.log('✅ Elasticsearch conectado:', health.status);
    
    // Generar 100 logs de ejemplo
    const logs = [];
    for (let i = 0; i < 100; i++) {
      logs.push(generateRandomLog());
    }
    
    console.log(`📊 Generando ${logs.length} logs de ejemplo...`);
    
    // Indexar los logs en Elasticsearch
    const body = logs.flatMap(log => [
      { index: { _index: 'microservices-logs-' + new Date().toISOString().split('T')[0] } },
      log
    ]);
    
    const response = await client.bulk({ body });
    
    if (response.errors) {
      console.error('❌ Error al indexar algunos documentos:', response.items.filter(item => item.index.error));
    } else {
      console.log('✅ Todos los logs indexados correctamente');
    }
    
    // Verificar que los datos estén disponibles
    const count = await client.count({
      index: 'microservices-logs-*'
    });
    
    console.log(`📈 Total de documentos en Elasticsearch: ${count.count}`);
    console.log('🎉 Datos generados exitosamente!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Ve a http://localhost:5601');
    console.log('2. Crea un index pattern: microservices-logs*');
    console.log('3. Selecciona timestamp como campo de tiempo');
    console.log('4. Ve a Discover para ver los datos');
    console.log('5. Crea visualizaciones y dashboards');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('🔧 Solución de problemas:');
    console.log('1. Verifica que Elasticsearch esté funcionando: curl http://localhost:9200');
    console.log('2. Verifica que docker-compose esté ejecutándose: docker-compose ps');
    console.log('3. Espera unos minutos si acabas de iniciar los servicios');
  }
}

// Ejecutar el script
generateSampleData();
