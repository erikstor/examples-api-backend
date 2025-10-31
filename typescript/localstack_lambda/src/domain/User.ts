/**
 * DOMAIN LAYER - Entidades y objetos de valor
 * Capa más interna, no depende de ninguna otra capa
 */

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

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: string,
    public updatedAt: string,
    public age?: number
  ) {}

  static create(input: CreateUserInput, id: string): UserEntity {
    const now = new Date().toISOString();
    return new UserEntity(
      id,
      input.email,
      input.name,
      now,
      now,
      input.age
    );
  }

  toJSON(): User {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      age: this.age,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

