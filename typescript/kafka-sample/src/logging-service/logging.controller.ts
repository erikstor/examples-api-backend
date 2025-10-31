import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggingService } from './logging.service';
import { LogResponse } from '@/shared/interfaces';
import { LogMessageDto } from '@/shared/dto';

@Controller('logs')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) { }

  @Get()
  async getAllLogs(): Promise<LogResponse[]> {
    return this.loggingService.getAllLogs();
  }

  @Get('stats')
  async getLogStats(): Promise<any> {
    return this.loggingService.getLogStats();
  }

  @Get('elasticsearch-stats')
  async getElasticsearchStats(): Promise<any> {
    return this.loggingService.getElasticsearchStats();
  }

  @Get('search')
  async searchLogs(@Query('q') query: string): Promise<any> {
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

  @Get('service/:serviceName')
  async getLogsByService(@Query('serviceName') serviceName: string): Promise<LogResponse[]> {
    return this.loggingService.getLogsByService(serviceName);
  }

  @Get('level/:level')
  async getLogsByLevel(@Query('level') level: string): Promise<LogResponse[]> {
    return this.loggingService.getLogsByLevel(level);
  }

  // Consumir mensajes de Kafka del User Service
  @MessagePattern('user-logs')
  async handleUserLogs(@Payload() logMessage: LogMessageDto): Promise<void> {
    console.log('📝 [LOGGING SERVICE] Recibido log del User Service:', logMessage);
    await this.loggingService.storeLog(logMessage);
  }

  // Consumir mensajes de Kafka del Create User Service
  @MessagePattern('create-user-logs')
  async handleCreateUserLogs(@Payload() logMessage: LogMessageDto): Promise<void> {
    console.log('📝 [LOGGING SERVICE] Recibido log del Create User Service:', logMessage);
    await this.loggingService.storeLog(logMessage);
  }
}
