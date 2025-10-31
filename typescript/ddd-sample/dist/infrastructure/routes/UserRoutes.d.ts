import { Application } from 'express';
import { UserController } from '../controllers/UserController';
export declare class UserRoutes {
    private app;
    private userController;
    constructor(userController: UserController);
    private setupMiddleware;
    private setupRoutes;
    getApp(): Application;
}
//# sourceMappingURL=UserRoutes.d.ts.map