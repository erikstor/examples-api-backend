export declare class CreateUserDto {
    name: string;
    email: string;
    age: number;
}
export declare class LogMessageDto {
    service: string;
    action: string;
    data: any;
    level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
}
