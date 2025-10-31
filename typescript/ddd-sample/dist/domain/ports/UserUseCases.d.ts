import { User } from '../entities/User';
export interface GetUserUseCase {
    execute(userId: string): Promise<User>;
}
export interface CreateUserUseCase {
    execute(userData: {
        id: string;
        email: string;
        name: string;
    }): Promise<User>;
}
export interface ListUsersUseCase {
    execute(): Promise<User[]>;
}
//# sourceMappingURL=UserUseCases.d.ts.map