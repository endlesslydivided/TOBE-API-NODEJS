import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Length } from "class-validator";

export class UpdatePostDto {

  @ApiProperty({ example: "My first post", description: "Post title" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 75, { message: "Длина заголовка поста: от 1 до 75 символов" })
  readonly title: string;

  @ApiProperty({ example: "My first post description", description: "Post description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 255, { message: "Длина описания: до 255 символов" })
  readonly description: string;

  @ApiProperty({ example: "My first post content", description: "Post content" })
  @IsString({ message: "Должно быть строкой" })
  @Length(1, 10000, { message: "Длина контента: от 1 до 10000 символов" })
  readonly content: string;

  @ApiProperty({ example: "0", description: "Category ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly categoryId: number;

  @ApiProperty({ example: "[1,2,3,4,5]", description: "Attachment's ID" })
  @IsNumber({}, { message: "Должно быть массивом чисел" })
  readonly attachmentsIds: number[];

  @ApiProperty({ example: "0", description: "User's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly newTags: string[];

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly oldTags: number[];
}