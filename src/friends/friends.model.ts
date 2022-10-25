import { Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";

interface FriendCreationAttribute
{
  friendId:number;
  userId:number;
  isRejected:boolean;
}

@Table({tableName:'friends',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Friend extends Model<Friend,FriendCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique friend entry identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'0',description:"ID of friend"})
  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER,allowNull: true})
  friendId:number;

  @ApiProperty({example:'0',description:"ID of user"})
  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER})
  userId:number;

  @ApiProperty({example:'0',description:"Did a friend reject a request?"})
  @Column({type:DataType.BOOLEAN})
  @Default(false)
  isRejected:boolean

}