import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
import { GetUserUseCase, CreateUserUseCase, ListUsersUseCase } from '../../domain/ports/UserUseCases';
export declare class GetUserUseCaseImpl implements GetUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<User>;
}
export declare class CreateUserUseCaseImpl implements CreateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userData: {
        id: string;
        email: string;
        name: string;
    }): Promise<User>;
}
export declare class ListUsersUseCaseImpl implements ListUsersUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(): Promise<User[]>;
}
//# sourceMappingURL=UserUseCases.d.ts.map