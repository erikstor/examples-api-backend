import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      node: 'http://localhost:9200',
    });

    // Verificar conexión
    try {
      const health = await this.client.cluster.health();
      console.log('✅ Elasticsearch conectado:', health.status);
      
      // Crear índice si no existe
      await this.createIndexIfNotExists();
    } catch (error) {
      console.error('❌ Error conectando a Elasticsearch:', error.message);
    }
  }

  private async createIndexIfNotExists(): Promise<void> {
    // Usar el mismo patrón que el script de datos de ejemplo
    const today = new Date().toISOString().split('T')[0];
    const indexName = `microservices-logs-${today}`;
    
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
        console.log(`✅ Índice ${indexName} creado exitosamente`);
      }
    } catch (error) {
      console.error('Error creando índice:', error.message);
    }
  }

  async indexLog(logData: any): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const indexName = `microservices-logs-${today}`;
      
      await this.client.index({
        index: indexName,
        body: {
          ...logData,
          timestamp: new Date(),
        },
      });
      console.log('📊 Log indexado en Elasticsearch');
    } catch (error) {
      console.error('Error indexando log:', error.message);
    }
  }

  async searchLogs(query: any): Promise<any> {
    try {
      const response = await this.client.search({
        index: 'microservices-logs-*',
        body: query,
      });
      return response;
    } catch (error) {
      console.error('Error buscando logs:', error.message);
      throw error;
    }
  }

  async getLogStats(): Promise<any> {
    try {
      const response = await this.client.search({
        index: 'microservices-logs-*',
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
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error.message);
      throw error;
    }
  }
}
