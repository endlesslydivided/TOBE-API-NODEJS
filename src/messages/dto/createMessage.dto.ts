import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Length } from "class-validator";

export class CreateMessageDto {

  @ApiProperty({ example: "Hi!", description: "Message text" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 1000, { message: "Длина сообщения: до 1000 символов" })
  readonly text: string;

  @ApiProperty({ example: "0", description: "Dialog's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly dialogId: number;

  @ApiProperty({ example: "0", description: "User's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly tags: string[];
}