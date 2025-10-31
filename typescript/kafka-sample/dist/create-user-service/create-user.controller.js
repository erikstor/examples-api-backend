"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const common_1 = require("@nestjs/common");
const create_user_service_1 = require("./create-user.service");
const logging_service_1 = require("./logging.service");
const dto_1 = require("@/shared/dto");
let CreateUserController = class CreateUserController {
    constructor(createUserService, loggingService) {
        this.createUserService = createUserService;
        this.loggingService = loggingService;
    }
    async createUser(createUserDto) {
        try {
            await this.loggingService.logAction('CREATE_USER_SERVICE', 'CREATE_USER_REQUEST', {
                userData: createUserDto,
                timestamp: new Date(),
            });
            const user = await this.createUserService.createUser(createUserDto);
            await this.loggingService.logAction('CREATE_USER_SERVICE', 'USER_CREATED', {
                userId: user.id,
                user: user,
                timestamp: new Date(),
            });
            return user;
        }
        catch (error) {
            await this.loggingService.logAction('CREATE_USER_SERVICE', 'CREATE_USER_ERROR', {
                userData: createUserDto,
                error: error.message,
                timestamp: new Date(),
            }, 'ERROR');
            throw error;
        }
    }
};
exports.CreateUserController = CreateUserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], CreateUserController.prototype, "createUser", null);
exports.CreateUserController = CreateUserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [create_user_service_1.CreateUserService,
        logging_service_1.LoggingService])
], CreateUserController);
//# sourceMappingURL=create-user.controller.js.map