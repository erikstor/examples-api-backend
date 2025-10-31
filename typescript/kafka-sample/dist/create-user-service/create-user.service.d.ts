import { User } from '@/shared/interfaces';
import { CreateUserDto } from '@/shared/dto';
export declare class CreateUserService {
    private readonly users;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
