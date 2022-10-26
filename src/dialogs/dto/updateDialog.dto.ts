import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UpdateDialogDto {
  @ApiProperty({ example: "Friends)", description: "Dialog name" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 50, { message: "Длина названия диалога: до 30 символов" })
  readonly name: string;
}