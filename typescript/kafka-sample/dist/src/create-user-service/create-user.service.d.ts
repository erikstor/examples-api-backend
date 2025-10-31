import { Repository } from 'typeorm';
import { User } from '@/shared/entities';
import { CreateUserDto } from '@/shared/dto';
export declare class CreateUserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
