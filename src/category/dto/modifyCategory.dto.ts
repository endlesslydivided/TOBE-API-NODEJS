import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ModifyCategoryDto {
  @ApiProperty({ example: "Sport", description: "Category name" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 30, { message: "Длина названия категории: от 2 до 30 символов" })
  readonly name: string;
}