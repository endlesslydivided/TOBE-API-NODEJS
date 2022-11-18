import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Alexander", description: "User's firstname" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 50, { message: "Длина имени: до 50 символов" })
  readonly firstName: string;

  @ApiProperty({ example: "Kovalyov", description: "User's lastname" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 50, { message: "Длина фамилии: до 50 символов" })
  readonly lastName: string;

  @ApiProperty({ example: "Man", description: "Sex" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 10, { message: "Не больше 10 символов" })
  readonly sex: string;

  @ApiProperty({ example: "Belarus", description: "User's country of living" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 50, { message: "Не больше 50 символов" })
  readonly country: string;

  @ApiProperty({ example: "Minsk", description: "User's city of living" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 100, { message: "Не больше 100 символов" })
  readonly city: string;

  @ApiProperty({ example: "user@do.men", description: "User's email" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;

  @ApiProperty({ example: "12345", description: "User's password" })
  @IsString({ message: "Должно быть строкой" })
  @Length(8, 30, { message: "Длина пароля: от 8 до 30 символов" })
  password: string;

  @ApiProperty({ example: "+375336947859", description: "User's phone number" })
  @IsString({ message: "Должно быть строкой" })
  @Length(8, 12, { message: "Длина номера телефона: от 8 до 12 символов" })
  readonly phoneNumber: string;

  @ApiProperty({ example: "12345", description: "User's password hash salt" })
  salt?: string;
}


