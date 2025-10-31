import { Repository } from 'typeorm';
import { User } from '@/shared/entities';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
}
