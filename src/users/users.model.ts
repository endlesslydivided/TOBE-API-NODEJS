import { BelongsToMany, Column, DataType, Default, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/userRoles.model";

interface UserCreationAttribute
{
  firstName:string;
  lastName:string;
  username:string;
  email:string;
  password:string;
  phoneNumber:string;
}

@Table({tableName:'users',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class User extends Model<User,UserCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique user identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'Alexander',description:"User's firstname"})
  @Column({type:DataType.STRING,allowNull:false})
  firstName:string;

  @ApiProperty({example:'Kovalyov',description:"User's lastname"})
  @Column({type:DataType.STRING,allowNull:false})
  lastName:string;

  @ApiProperty({example:'username',description:"User's username"})
  @Column({type:DataType.STRING,unique:true,allowNull:false})
  username:string;

  @ApiProperty({example:'user@do.men',description:"User's email"})
  @Column({type:DataType.STRING,unique:true,allowNull:false})
  email:string;

  @ApiProperty({example:'false',description:"Is user's email confirmed?"})
  @Default(false)
  @Column({type:DataType.BOOLEAN,allowNull:false})
  emailConfirmed:boolean;

  @ApiProperty({example:'12345',description:"User's password hash"})
  @Column({type:DataType.STRING,unique:true,allowNull:false})
  password:string;

  @ApiProperty({example:'12345',description:"User's password hash salt"})
  @Column({type:DataType.STRING,unique:true,allowNull:false})
  salt:string;

  @ApiProperty({example:'+375336947859',description:"User's phone number"})
  @Column({type:DataType.STRING,unique:true,allowNull:false})
  phoneNumber:string;

  @ApiProperty({example:'false',description:"Is user's phone number confirmed?"})
  @Default(false)
  @Column({type:DataType.BOOLEAN,allowNull:false})
  phoneNumberConfirmed:boolean;

  @ApiProperty({example:'false',description:"Is two factor authentication enabled?"})
  @Default(false)
  @Column({type:DataType.BOOLEAN,allowNull:false})
  twoFactorEnabled:boolean;

  @ApiProperty({example:'0',description:"Failed attempts to access users account"})
  @Default(0)
  @Column({type:DataType.INTEGER})
  accessFailedCount:number

  @BelongsToMany(() => Role,() => UserRoles)
  roles:Role[];
}