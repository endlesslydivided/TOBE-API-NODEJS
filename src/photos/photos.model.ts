import { Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { Album } from "../albums/albums.model";
import { Tag } from "../tags/tags.model";

interface AlbumCreationAttribute
{
  name:string;
  description:string;
  userId:number;
}

@Table({tableName:'photos',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Photo extends Model<Photo,AlbumCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique photo identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'./photos/1.png',description:"Photo path on the server"})
  @Column({type:DataType.STRING,allowNull:true})
  path:string;

  @ApiProperty({example:'My first photo description',description:"Photo description"})
  @Column({type:DataType.STRING,allowNull:true})
  description:string;

  @ApiProperty({example:'0',description:"ID of photo album"})
  @ForeignKey(() => Album)
  @Column({type:DataType.INTEGER,allowNull:true})
  albumId:number

  @HasOne(() => User, "mainPhoto")
  user: User;

  @HasMany(() => Tag,{foreignKey:"taggableId",scope: { taggableType: "photo" },
    constraints:true,onDelete:"set null",onUpdate:"cascade"})
  tags:Tag[]
}