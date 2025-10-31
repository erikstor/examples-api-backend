import { User } from '../../shared/interfaces';
export declare class UserService {
    private users;
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
}
