import { Controller, Get, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggingService } from './logging.service';
import { User } from '@/shared/entities';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggingService: LoggingService,
  ) { }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      // Log de la acción
      await this.loggingService.logAction('USER_SERVICE', 'GET_USER_BY_ID', {
        userId: id,
        timestamp: new Date(),
      });

      const user = await this.userService.getUserById(id);

      Logger.log('UserController: getUserById');
      Logger.log(user);

      if (!user) {
        await this.loggingService.logAction('USER_SERVICE', 'USER_NOT_FOUND', {
          userId: id,
          timestamp: new Date(),
        }, 'WARN');

        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      await this.loggingService.logAction('USER_SERVICE', 'USER_FOUND', {
        userId: id,
        user: user,
        timestamp: new Date(),
      });

      return user;
    } catch (error) {
      await this.loggingService.logAction('USER_SERVICE', 'GET_USER_ERROR', {
        userId: id,
        error: error.message,
        timestamp: new Date(),
      }, 'ERROR');

      throw error;
    }
  }
}
