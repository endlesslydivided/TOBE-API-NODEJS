import { AfterFind, BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Message } from "../messages/messages.model";
import { Post } from "../posts/posts.model";
import { Photo } from "../photos/photos.model";

interface TagCreationAttribute
{
  name:string;
  taggableId:number;
  taggableType:string;
}

@Table({tableName:'tags',timestamps:false})
export class Tag extends Model<Tag,TagCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique tag identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'pets',description:"Tag name"})
  @Column({type:DataType.STRING,allowNull:false})
  name:string;

  @ApiProperty({example:'0',description:"Tag using entry id"})
  @Column({type:DataType.INTEGER,allowNull:true})
  taggableId:number;

  @ApiProperty({example:'pets',description:"Tag using entry type"})
  @Column({type:DataType.STRING,allowNull:false})
  taggableType:string;

  async getTaggable(options)
  {
    if(!this.taggableType)
    {
      return Promise.resolve(null);
    }
    const mixinMethodName= `get${this.upperCaseFirst(this.taggableType)}`;
    return this[mixinMethodName](options);
  }

  upperCaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;

  @AfterFind
  public static tagAfterFind(findResult: any)
  {
    if (!Array.isArray(findResult))
    {
      findResult = [findResult];
    }
    for (const instance of findResult)
    {
      if (instance.taggableType === "post" && instance.post !== undefined)
      {
        instance.taggable = instance.post;
      }
      else if (instance.taggableType === "message" && instance.message !== undefined)
      {
        instance.taggable = instance.message;
      }
      else if (instance.taggableType === "photo" && instance.message !== undefined)
      {
        instance.taggable = instance.photo;
      }
      // To prevent mistakes:
      delete instance.post;
      delete instance.dataValues.post;
      delete instance.message;
      delete instance.dataValues.message;
      delete instance.photo;
      delete instance.dataValues.photo;
    }
  }

  @BelongsTo(() => Post,{
    foreignKey:'taggableId',
    targetKey:'id',
    constraints:true,
    onDelete:'set null',
    onUpdate:'cascade'})
  post:Post;

  @BelongsTo(() => Message,{
    foreignKey:'taggableId',
    targetKey:'id',
    constraints:true,
    onDelete:'set null',
    onUpdate:'cascade'})
  message:Message;

  @BelongsTo(() => Message,{
    foreignKey:'taggableId',
    targetKey:'id',
    constraints:true,
    onDelete:'set null',
    onUpdate:'cascade'})
  photo:Photo;


}