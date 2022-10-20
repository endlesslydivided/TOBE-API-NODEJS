import { BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/userRoles.model";
import { User } from "../users/users.model";
import { UserDialog } from "./userDialogs.model";
import { Message } from "../messages/messages.model";

interface DialogCreationAttribute
{
  name:string;
  isChat:boolean;
  creatorId:number;
}

@Table({tableName:'dialogs',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Dialog extends Model<Dialog,DialogCreationAttribute>
{
  @ApiProperty({example:'0',description:"Unique dialog identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'Friends and family)',description:"Dialog firstname"})
  @Column({type:DataType.STRING,allowNull:false})
  name:string;

  @ApiProperty({example:'false',description:"Is dialog a chat?"})
  @Default(false)
  @Column({type:DataType.BOOLEAN,allowNull:false})
  isChat:boolean;

  @ApiProperty({example:'0',description:"ID of user, who created a dialog"})
  @ForeignKey(() => User)
  @Column({type:DataType.INTEGER})
  creatorId:number

  @BelongsToMany(() => User,() => UserDialog)
  users:User[];

  @HasMany(() => Message, "dialogId")
  messages: Message[];
}