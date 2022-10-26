import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Length } from "class-validator";

export class CreatePhotoDto {

  @ApiProperty({ example: "Hi!", description: "Photo description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 1000, { message: "Длина описания: до 255 символов" })
  readonly description: string;

  @ApiProperty({ example: "0", description: "Album's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly albumId: number;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly tags: string[];
}