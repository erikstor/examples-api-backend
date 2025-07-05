import { User } from '../model/User';

export class RegisterUserCommand {
  constructor(
    public readonly userData: User,
  ) { }
} 
