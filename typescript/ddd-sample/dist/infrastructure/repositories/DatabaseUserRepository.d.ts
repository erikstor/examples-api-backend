import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
export declare class DatabaseUserRepository implements UserRepository {
    private users;
    constructor();
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;
    private simulateDatabaseDelay;
    private initializeWithSampleData;
}
//# sourceMappingURL=DatabaseUserRepository.d.ts.map