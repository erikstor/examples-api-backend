import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/shared/entities';
import { CreateUserDto } from '@/shared/dto';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Validar que el email no exista
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
    }

    // Crear nuevo usuario
    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      age: createUserDto.age,
    });

    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
