import { CreateUserService } from './create-user.service';
import { LoggingService } from './logging.service';
import { User } from '@/shared/entities';
import { CreateUserDto } from '@/shared/dto';
export declare class CreateUserController {
    private readonly createUserService;
    private readonly loggingService;
    constructor(createUserService: CreateUserService, loggingService: LoggingService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
}
