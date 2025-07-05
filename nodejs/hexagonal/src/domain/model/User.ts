import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class User {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @Length(2, 50, { message: "El nombre debe tener entre 2 y 50 caracteres" })
  name!: string

  @IsEmail({}, { message: "El correo electrónico debe tener un formato válido" })
  @IsNotEmpty({ message: "El correo electrónico es requerido" })
  email!: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
} 
