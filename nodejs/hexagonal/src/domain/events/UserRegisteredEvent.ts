import { User } from '../model/User';

export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly user: User,
    public readonly timestamp: Date
  ) { }
} 
