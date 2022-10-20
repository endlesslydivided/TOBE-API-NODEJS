import { BelongsToMany, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { Dialog } from "./dialogs.model";

@Table({tableName:'userDialog',timestamps:true,createdAt:"createdAt",updatedAt:false})
export class UserDialog extends Model<UserDialog>
{
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER})
  userId:number;

  @ForeignKey(() => Dialog)
  @Column({type:DataType.INTEGER})
  dialogId:number;
}