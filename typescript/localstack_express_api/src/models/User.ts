export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  age?: number;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  age?: number;
}

