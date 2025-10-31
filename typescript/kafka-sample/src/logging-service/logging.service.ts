import { Injectable } from '@nestjs/common';
import { LogResponse } from '@/shared/interfaces';
import { LogMessageDto } from '@/shared/dto';
import { ElasticsearchService } from '@/shared/services/elasticsearch.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingService {
  // Almacenamiento en memoria de logs
  private logs: LogResponse[] = [];

  constructor(private readonly elasticsearchService: ElasticsearchService) { }

  async storeLog(logMessage: LogMessageDto): Promise<void> {
    const logEntry: LogResponse = {
      id: uuidv4(),
      service: logMessage.service,
      action: logMessage.action,
      timestamp: new Date(),
      data: logMessage.data,
      level: logMessage.level,
    };

    // Almacenar en memoria
    this.logs.push(logEntry);

    // Mantener solo los últimos 1000 logs para evitar crecimiento excesivo
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Enviar a Elasticsearch para análisis avanzado
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
    } catch (error) {
      console.error('Error enviando log a Elasticsearch:', error.message);
    }

    console.log(`✅ Log almacenado: [${logEntry.service}] ${logEntry.action} - ${logEntry.level}`);
  }

  async getAllLogs(): Promise<LogResponse[]> {
    return this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getLogStats(): Promise<any> {
    const stats = {
      totalLogs: this.logs.length,
      logsByService: {},
      logsByLevel: {},
      recentLogs: this.logs.slice(-10),
    };

    // Contar logs por servicio
    this.logs.forEach(log => {
      stats.logsByService[log.service] = (stats.logsByService[log.service] || 0) + 1;
      stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1;
    });

    return stats;
  }

  async getElasticsearchStats(): Promise<any> {
    try {
      return await this.elasticsearchService.getLogStats();
    } catch (error) {
      console.error('Error obteniendo estadísticas de Elasticsearch:', error.message);
      return { error: 'No se pudieron obtener estadísticas de Elasticsearch' };
    }
  }

  async searchLogsInElasticsearch(query: any): Promise<any> {
    try {
      return await this.elasticsearchService.searchLogs(query);
    } catch (error) {
      console.error('Error buscando logs en Elasticsearch:', error.message);
      throw error;
    }
  }

  async getLogsByService(service: string): Promise<LogResponse[]> {
    return this.logs
      .filter(log => log.service === service)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getLogsByLevel(level: string): Promise<LogResponse[]> {
    return this.logs
      .filter(log => log.level === level)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
