import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateFriendDto {

  @ApiProperty({ example: "0", description: "User's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;

  @ApiProperty({ example: "1", description: "Friend's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly friendId: number;
}