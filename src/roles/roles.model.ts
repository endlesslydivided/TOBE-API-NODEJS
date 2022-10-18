import { BelongsToMany, Column, DataType, Default, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { UserRoles } from "./userRoles.model";

interface RolesCreationAttribute
{
  name:string;
  description:string;
}

@Table({tableName:'roles',timestamps:true,createdAt:"createdAt",updatedAt:"updatedAt"})
export class Role extends Model<Role,RolesCreationAttribute>
{
  @ApiProperty({example:'1',description:"Unique role identifier"})
  @Column({type:DataType.INTEGER,unique:true,autoIncrement:true,primaryKey:true})
  id:number;

  @ApiProperty({example:'ADMIN',description:"Role name"})
  @Column({type:DataType.STRING,allowNull:false})
  name:string;

  @ApiProperty({example:'Role to manipulate with global application config',description:"Role description"})
  @Column({type:DataType.STRING,allowNull:false})
  description:string;

  @BelongsToMany(() => User,() => UserRoles)
  users:User[];

}