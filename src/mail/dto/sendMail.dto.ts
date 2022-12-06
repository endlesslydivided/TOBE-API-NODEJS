import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNumber, IsString, Length } from "class-validator";

export class SendMailDto {

  @ApiProperty({ example: "Security notification", description: "Email title" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 50, { message: "Длина названия диалога: до 30 символов" })
  readonly title: string;

  @ApiProperty({ example: "Hi!", description: "Is dialog a chat?" })
  @IsString({ message: "Должно быть строкой" })
  readonly message: string;

  @ApiProperty({ example: "[1234@mail.com]", description: "Recipient's emails" })
  @IsArray({message: 'Массив почт пуст или содержит неверное значение'})
  readonly emails: string[];

}