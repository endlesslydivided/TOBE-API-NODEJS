import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Attachment } from "../attachments/attachments.model";
import { User } from "../users/users.model";
import { Category } from "../category/category.model";
import { Tag } from "../tags/tags.model";

interface PostCreationAttribute
{
  title:string;
  description:string;
  content:string;
  categoryId:number;
  userId:number;
}

@Table({tableName:'posts',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Post extends Model<Post,PostCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique post identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'My first post',description:"Post title"})
  @Column({type:DataType.STRING,allowNull:false})
  title:string;

  @ApiProperty({example:'My first post description',description:"Post description"})
  @Column({type:DataType.STRING,allowNull:true})
  description:string;

  @ApiProperty({example:'My first post content',description:"Post content"})
  @Column({type:DataType.STRING,allowNull:false})
  content:string;

  @ApiProperty({example:'0',description:"ID of post category"})
  @ForeignKey(() => Category)
  @Column({type:DataType.INTEGER,allowNull:true})
  categoryId:number

  @ApiProperty({example:'0',description:"ID of post user"})
  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER,allowNull:true})
  userId:number

  @HasMany(() => Attachment,{foreignKey:"attachableId",scope: { attachableType: "post" },
                                                    constraints:true,onDelete:"set null",onUpdate:"cascade"})
  attachments:Attachment[]

  @HasMany(() => Tag,{foreignKey:"taggableId",scope: { taggableType: "post" },
    constraints:true,onDelete:"set null",onUpdate:"cascade"})
  tags:Tag[]

}