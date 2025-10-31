import { IsString, IsEmail, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @Min(1)
  @Max(120)
  age: number;
}

export class LogMessageDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  data: any;

  @IsString()
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
}
