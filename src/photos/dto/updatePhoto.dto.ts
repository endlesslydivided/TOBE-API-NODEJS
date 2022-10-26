import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, Length } from "class-validator";

export class UpdatePhotoDto {

  @ApiProperty({ example: "Hi!", description: "Photo description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 1000, { message: "Длина сообщения: до 1000 символов" })
  readonly description: string;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly newTags: string[];

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly oldTags: number[];
}