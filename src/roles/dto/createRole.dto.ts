import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateRoleDto {

  @ApiProperty({ example: "USER", description: "Role name" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 15, { message: "Длина названия роли: от 0 до 15 символов" })
  readonly value: string;

  @ApiProperty({ example: "Role description", description: "Role description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 255, { message: "Длина описания: до 255 символов" })
  readonly description: string;
}