import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {

  @ApiProperty({ example: "USER", description: "Role name" })
  @IsString({ message: "Должно быть строкой" })
  readonly value: string;

  @ApiProperty({ example: "0", description: "Users ID" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;
}
