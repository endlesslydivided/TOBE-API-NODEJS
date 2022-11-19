import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { IsFile,HasMimeType, MemoryStoredFile } from "nestjs-form-data";
import { stringify } from "querystring";

export class CreatePhotoDto {

  @ApiProperty({ example: "Hi!", description: "Photo description" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 1000, { message: "Длина описания: до 255 символов" })
  
  @IsOptional()
  readonly description: string = '';

  @ApiProperty({ example: "0", description: "Album's ID" })
  @Transform(({ value }) => parseInt(value))
  albumId: number;

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  @IsOptional()
  readonly tags: string[] = [];

  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png','image/jpg'])
  readonly file: MemoryStoredFile;
}