export declare class User {
    private readonly _id;
    private readonly _email;
    private readonly _name;
    private readonly _createdAt;
    private constructor();
    static create(id: string, email: string, name: string): User;
    static fromPersistence(id: string, email: string, name: string, createdAt: Date): User;
    get id(): string;
    get email(): string;
    get name(): string;
    get createdAt(): Date;
    private static isValidEmail;
    changeName(newName: string): User;
    toJSON(): {
        id: string;
        email: string;
        name: string;
        createdAt: string;
    };
}
//# sourceMappingURL=User.d.ts.map