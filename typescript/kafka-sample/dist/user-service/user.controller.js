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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const logging_service_1 = require("./logging.service");
let UserController = class UserController {
    constructor(userService, loggingService) {
        this.userService = userService;
        this.loggingService = loggingService;
    }
    async getUserById(id) {
        try {
            await this.loggingService.logAction('USER_SERVICE', 'GET_USER_BY_ID', {
                userId: id,
                timestamp: new Date(),
            });
            const user = await this.userService.getUserById(id);
            if (!user) {
                await this.loggingService.logAction('USER_SERVICE', 'USER_NOT_FOUND', {
                    userId: id,
                    timestamp: new Date(),
                }, 'WARN');
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            await this.loggingService.logAction('USER_SERVICE', 'USER_FOUND', {
                userId: id,
                user: user,
                timestamp: new Date(),
            });
            return user;
        }
        catch (error) {
            await this.loggingService.logAction('USER_SERVICE', 'GET_USER_ERROR', {
                userId: id,
                error: error.message,
                timestamp: new Date(),
            }, 'ERROR');
            throw error;
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        logging_service_1.LoggingService])
], UserController);
//# sourceMappingURL=user.controller.js.map