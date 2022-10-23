import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { Photo } from "../photos/photos.model";

interface AlbumCreationAttribute
{
  name:string;
  description:string;
  userId:number;
}

@Table({tableName:'albums',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Album extends Model<Album,AlbumCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique album identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'My first album name',description:"Album name"})
  @Column({type:DataType.STRING,allowNull:true})
  name:string;

  @ApiProperty({example:'My first album description',description:"Album description"})
  @Column({type:DataType.STRING,allowNull:true})
  description:string;

  @ApiProperty({example:'0',description:"ID of album user"})
  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER})
  userId:number

  @HasMany(() => Photo, {foreignKey:"albumId",
    constraints:true,onDelete:"cascade",onUpdate:"cascade"})
  photos: Photo[];
}