import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class UpdateFriendDto 
{

  @ApiProperty({ example: "null", description: "Is a friendship request rejected?" })
  @IsBoolean({ message: "Должно быть true, false или null" })
  readonly isRejected: boolean;

}