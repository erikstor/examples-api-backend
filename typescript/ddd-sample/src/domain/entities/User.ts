// Domain Layer - Entidad User
export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _name: string,
    private readonly _createdAt: Date
  ) {}

  // Factory method para crear un usuario
  static create(id: string, email: string, name: string): User {
    if (!id || !email || !name) {
      throw new Error('ID, email y name son requeridos para crear un usuario');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('El formato del email no es válido');
    }

    return new User(id, email, name, new Date());
  }

  // Factory method para reconstruir desde persistencia
  static fromPersistence(id: string, email: string, name: string, createdAt: Date): User {
    return new User(id, email, name, createdAt);
  }

  // Getters para acceder a las propiedades privadas
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Método de dominio para validar email
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método de dominio para cambiar el nombre
  changeName(newName: string): User {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    return new User(this._id, this._email, newName.trim(), this._createdAt);
  }

  // Método para serializar la entidad
  toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      createdAt: this._createdAt.toISOString()
    };
  }
}
