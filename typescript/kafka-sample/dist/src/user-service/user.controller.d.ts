import { UserService } from './user.service';
import { LoggingService } from './logging.service';
import { User } from '@/shared/entities';
export declare class UserController {
    private readonly userService;
    private readonly loggingService;
    constructor(userService: UserService, loggingService: LoggingService);
    getUserById(id: string): Promise<User>;
}
