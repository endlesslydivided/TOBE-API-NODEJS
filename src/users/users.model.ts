import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/userRoles.model";
import { Dialog } from "../dialogs/dialogs.model";
import { UserDialog } from "../dialogs/userDialogs.model";
import { Message } from "../messages/messages.model";
import { Post } from "../posts/posts.model";
import { Album } from "../albums/albums.model";
import { Photo } from "../photos/photos.model";
import { Friend } from "../friends/friends.model";

interface UserCreationAttribute {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@Table({ tableName: "users", timestamps: true, createdAt: "createdAt", updatedAt: "updatedAt" })
export class User extends Model<User, UserCreationAttribute> {
  @ApiProperty({ example: "1", description: "Unique user identifier" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "Alexander", description: "User's firstname" })
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @ApiProperty({ example: "Kovalyov", description: "User's lastname" })
  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @ApiProperty({ example: "user@do.men", description: "User's email" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "false", description: "Is user's email confirmed?" })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  emailConfirmed: boolean;

  @ApiProperty({ example: "12345", description: "User's password hash" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  password: string;

  @ApiProperty({ example: "12345", description: "User's password hash salt" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  salt: string;

  @ApiProperty({ example: "+375336947859", description: "User's phone number" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  phoneNumber: string;

  @ApiProperty({ example: "Man", description: "Sex" })
  @Column({ type: DataType.STRING, allowNull: false})
  sex: string;

  @ApiProperty({ example: "Belarus", description: "User's country of living" })
  @Column({ type: DataType.STRING, allowNull: false})
  country: string;

  @ApiProperty({ example: "Minsk", description: "User's city of living" })
  @Column({ type: DataType.STRING, allowNull: false})
  city: string;

  @ApiProperty({ example: "false", description: "Is user's phone number confirmed?" })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  phoneNumberConfirmed: boolean;

  @ApiProperty({ example: "false", description: "Is two factor authentication enabled?" })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ example: "0", description: "Failed attempts to access user's account" })
  @Default(0)
  @Column({ type: DataType.INTEGER })
  accessFailedCount: number;

  @ApiProperty({ example: "0", description: "ID of main photo" })
  @ForeignKey(() => Photo)
  @Column({ type: DataType.INTEGER })
  mainPhoto: number;

  @ApiProperty({ example: "0", description: "12345" })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  refreshToken: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => Dialog, () => UserDialog)
  dialogs: Dialog[];

  @BelongsTo(() => Photo, {
    foreignKey: "mainPhoto",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  photo: Photo;

  @HasMany(() => Dialog, {
    foreignKey: "creatorId",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  createdDialogs: Dialog[];

  @HasMany(() => Message, {
    foreignKey: "userId",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  messages: Message[];

  @HasMany(() => Post, {
    foreignKey: "userId",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  posts: Post[];

  @HasMany(() => Album, {
    foreignKey: "userId",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  albums: Album[];

  @HasMany(() => Friend, {
    foreignKey: "userId",
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  friends: Friend[];


}