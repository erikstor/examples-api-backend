import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { LoggingService } from './logging.service';
import { User } from '@/shared/entities';
import { CreateUserDto } from '@/shared/dto';

@Controller('users')
export class CreateUserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      // Log de la acción
      await this.loggingService.logAction('CREATE_USER_SERVICE', 'CREATE_USER_REQUEST', {
        userData: createUserDto,
        timestamp: new Date(),
      });

      const user = await this.createUserService.createUser(createUserDto);

      await this.loggingService.logAction('CREATE_USER_SERVICE', 'USER_CREATED', {
        userId: user.id,
        user: user,
        timestamp: new Date(),
      });

      return user;
    } catch (error) {
      await this.loggingService.logAction('CREATE_USER_SERVICE', 'CREATE_USER_ERROR', {
        userData: createUserDto,
        error: error.message,
        timestamp: new Date(),
      }, 'ERROR');

      throw error;
    }
  }
}
