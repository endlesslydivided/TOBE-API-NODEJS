import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString, Length } from "class-validator";

export class CreateDialogDto {

  @ApiProperty({ example: "Friends)", description: "Dialog name" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 50, { message: "Длина названия диалога: до 30 символов" })
  readonly name: string;

  @ApiProperty({ example: "False", description: "Is dialog a chat?" })
  @IsBoolean({ message: "Должно быть true или false" })
  readonly isChat: boolean;

  @ApiProperty({ example: "0", description: "Creator's id" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly creatorId: number;

  @ApiProperty({ example: "[0,1,2,3]", description: "User's IDs" })
  @IsArray({ message: "Должно быть числом" })
  readonly usersId: number[];
}