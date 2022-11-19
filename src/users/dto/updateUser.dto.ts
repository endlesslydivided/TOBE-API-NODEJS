import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: "Alexander", description: "User's firstname" })
    @IsString({ message: "Должно быть строкой" })
    @Length(0, 50, { message: "Длина имени: до 50 символов" })
    @IsOptional()
    readonly firstName: string;
  
    @ApiProperty({ example: "Kovalyov", description: "User's lastname" })
    @IsString({ message: "Должно быть строкой" })
    @Length(0, 50, { message: "Длина фамилии: до 50 символов" })
    @IsOptional()
    readonly lastName: string;
  
    @ApiProperty({ example: "username", description: "User's username" })
    @IsString({ message: "Должно быть строкой" })
    @Length(3, 25, { message: "Длина логина: до 50 символов" })
    @IsOptional()
    readonly username: string;
  
    @ApiProperty({ example: "user@do.men", description: "User's email" })
    @IsString({ message: "Должно быть строкой" })
    @IsEmail({}, { message: "Некорректный email" })
    @IsOptional()
    readonly email: string;
  
    @ApiProperty({ example: "12345", description: "User's password" })
    @IsString({ message: "Должно быть строкой" })
    @Length(8, 30, { message: "Длина пароля: от 8 до 30 символов" })
    @IsOptional()
    password: string;
  
    @ApiProperty({ example: "+375336947859", description: "User's phone number" })
    @IsString({ message: "Должно быть строкой" })
    @Length(8, 11, { message: "Длина номера телефона: от 8 до 11 символов" })
    @IsOptional()
    readonly phoneNumber: string;

    @ApiProperty({ example: "0", description: "User's main photo ID" })
    @IsNumber({},{ message: "Должно быть числом" })
    @IsOptional()
    readonly mainPhoto: number;
  
    @ApiProperty({ example: "12345", description: "User's password hash salt" })
    @IsOptional()
    salt?: string;
  }