import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsEmail, IsNumber, IsString, Length } from "class-validator";
import { Column, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "../../users/users.model";

export class CreateAlbumDto
{
  @ApiProperty({example:'My first album name',description:"Album name"})
  @IsString({message: "Должно быть строкой"})
  @Length(0,50,{message:"Длина названия альбома: до 50 символов"})
  name:string;

  @ApiProperty({example:'My first album description',description:"Album description"})
  @IsString({message: "Должно быть строкой"})
  @Length(0,255,{message:"Длина названия альбома: до 255 символов"})
  description:string;

  @ApiProperty({example:'0',description:"ID of album user"})
  @IsNumber({},{message:"Должно быть числом"})
  userId:number

}


