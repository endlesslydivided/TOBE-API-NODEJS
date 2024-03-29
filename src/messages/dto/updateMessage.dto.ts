import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, Length } from "class-validator";

export class UpdateMessageDto {

  @ApiProperty({ example: "Hi!", description: "Message text" })
  @IsString({ message: "Должно быть строкой" })
  @Length(0, 1000, { message: "Длина сообщения: до 1000 символов" })
  readonly text: string;

  @ApiProperty({ example: "[0,1,2,3]", description: "Message attachments ID" })
  @IsArray({ message: "Должно быть массивом чисел" })
  readonly attachmentsIds: number[];

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly newTags: string[];

  @ApiProperty({ example: "['sport','goals','news']", description: "Tags" })
  @IsArray({ message: "Должно быть массивом строк" })
  readonly oldTags: number[];

}