import { RegisterUserCommand } from '../commands/RegisterUserCommand';
// import { UserRegisteredEvent } from '../events/UserRegisteredEvent';
import { IUserRepository } from '../ports/IUserRepository';
import { EmailAlreadyExistsException } from '../exceptions/UserException';
import { User } from '../model/User';

export interface RegisterUserResult {
  userId: string;
  user: User;
  timestamp: Date;
}

export class RegisterUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository
  ) { }

  async handle(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const { userData } = command;

    // Verificar que el email no exista
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    // Guardar el usuario
    const userId = await this.userRepository.save(userData);
    const timestamp = new Date();

    // Emitir evento (en una implementación real, esto se haría a través de un event bus)
    // const event = new UserRegisteredEvent(userId, userData, timestamp);
    // this.eventBus.publish(event);

    return {
      userId,
      user: userData,
      timestamp
    };
  }
} 
