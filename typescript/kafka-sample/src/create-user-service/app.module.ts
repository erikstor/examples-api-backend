import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from './create-user.service';
import { LoggingModule } from './logging.module';
import { User } from '@/shared/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    LoggingModule,
  ],
  controllers: [CreateUserController],
  providers: [CreateUserService],
})
export class AppModule {}
