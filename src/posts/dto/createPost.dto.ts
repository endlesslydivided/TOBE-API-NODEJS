import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { IsFiles, MemoryStoredFile } from "nestjs-form-data";

export class CreatePostDto {

  @ApiProperty({ example: "My first post", description: "Post title" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 100, { message: "Длина заголовка поста: от 1 до 100 символов" })
  @IsOptional()
  readonly title: string;

  @ApiProperty({ example: "My first post description", description: "Post description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 255, { message: "Длина описания: до 255 символов" })
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: "My first post content", description: "Post content" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 10000, { message: "Длина контента: до 10000 символов" })
  @IsOptional()
  readonly content: string;

  @ApiProperty({ example: "0", description: "User's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;

  @ApiProperty({ example: "0", description: "Category ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  readonly categoryId: number;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  @IsOptional()
  readonly tags: string[] = [];

  @IsFiles()
  readonly files: MemoryStoredFile[];
}