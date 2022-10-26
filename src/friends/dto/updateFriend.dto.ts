import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class UpdateFriendDto {
  @ApiProperty({ example: "1", description: "User's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;

  @ApiProperty({ example: "0", description: "Friend's ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly friendId: number;

  @ApiProperty({ example: "null", description: "Is a friendship request rejected?" })
  @IsBoolean({ message: "Должно быть true, false или null" })
  readonly isRejected: boolean;

}