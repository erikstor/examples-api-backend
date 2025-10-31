"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let CreateUserService = class CreateUserService {
    constructor() {
        this.users = [];
    }
    async createUser(createUserDto) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const existingUser = this.users.find(u => u.email === createUserDto.email);
        if (existingUser) {
            throw new common_1.HttpException('El email ya está en uso', common_1.HttpStatus.CONFLICT);
        }
        const newUser = {
            id: (0, uuid_1.v4)(),
            name: createUserDto.name,
            email: createUserDto.email,
            age: createUserDto.age,
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
    async getAllUsers() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.users;
    }
};
exports.CreateUserService = CreateUserService;
exports.CreateUserService = CreateUserService = __decorate([
    (0, common_1.Injectable)()
], CreateUserService);
//# sourceMappingURL=create-user.service.js.map