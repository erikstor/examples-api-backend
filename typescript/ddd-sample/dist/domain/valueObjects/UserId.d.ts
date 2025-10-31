export declare class UserId {
    private readonly value;
    private constructor();
    static create(value: string): UserId;
    getValue(): string;
    equals(other: UserId): boolean;
    toString(): string;
}
export declare class Email {
    private readonly value;
    private constructor();
    static create(value: string): Email;
    getValue(): string;
    private static isValidEmail;
    equals(other: Email): boolean;
    toString(): string;
}
//# sourceMappingURL=UserId.d.ts.map