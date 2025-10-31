import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
export declare class InMemoryUserRepository implements UserRepository {
    private users;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;
    initializeWithSampleData(): void;
}
//# sourceMappingURL=InMemoryUserRepository.d.ts.map