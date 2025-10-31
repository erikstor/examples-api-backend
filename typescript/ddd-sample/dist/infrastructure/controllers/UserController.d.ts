import { Request, Response } from 'express';
import { GetUserUseCase, CreateUserUseCase, ListUsersUseCase } from '../../domain/ports/UserUseCases';
export declare class UserController {
    private readonly getUserUseCase;
    private readonly createUserUseCase;
    private readonly listUsersUseCase;
    constructor(getUserUseCase: GetUserUseCase, createUserUseCase: CreateUserUseCase, listUsersUseCase: ListUsersUseCase);
    getUserById(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    listUsers(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map