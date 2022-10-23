import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Post } from "../posts/posts.model";

interface CategoryCreationAttribute
{
  name:string;
}

@Table({tableName:'categories',timestamps:false})
export class Category extends Model<Category,CategoryCreationAttribute>
{
  @ApiProperty({example:'0',description:"Unique category identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'Medicine',description:"Category name"})
  @Column({type:DataType.STRING,allowNull:false})
  name:string;

  @HasMany(() => Post,{foreignKey:"categoryId",constraints:true,onDelete:"set null",onUpdate:"cascade"})
  posts:Post[]

}