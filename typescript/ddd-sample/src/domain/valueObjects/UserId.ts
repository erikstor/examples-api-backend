// Domain Layer - Value Objects
export class UserId {
  private constructor(private readonly value: string) {}

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error('El ID del usuario no puede estar vacío');
    }
    return new UserId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    if (!this.isValidEmail(value)) {
      throw new Error('El formato del email no es válido');
    }

    return new Email(value.toLowerCase().trim());
  }

  getValue(): string {
    return this.value;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
