import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto
{
  @ApiProperty({example:'Alexander',description:"User's firstname"})
  readonly firstName:string;

  @ApiProperty({example:'Kovalyov',description:"User's lastname"})
  readonly lastName:string;

  @ApiProperty({example:'username',description:"User's username"})
  readonly username:string;

  @ApiProperty({example:'user@do.men',description:"User's email"})
  readonly email:string;

  @ApiProperty({example:'12345',description:"User's password"})
  passwordHash:string;

  @ApiProperty({example:'+375336947859',description:"User's phone number"})
  readonly phoneNumber:string;

  @ApiProperty({example:'12345',description:"User's password hash salt"})
  salt?: string;
}


