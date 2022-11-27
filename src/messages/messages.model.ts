import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { Dialog } from "../dialogs/dialogs.model";
import { Attachment } from "../attachments/attachments.model";
import { Tag } from "../tags/tags.model";

interface MessageCreationAttribute {
  dialogId: number;
  userId: number;
  text: string;
}

@Table({ tableName: "messages", timestamps: true, createdAt: "createdAt", updatedAt: "updatedAt" })
export class Message extends Model<Message, MessageCreationAttribute> {
  @ApiProperty({ example: "1", description: "Unique message identifier" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "Hi!", description: "Message text" })
  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @ApiProperty({ example: "0", description: "ID of message dialog" })
  @ForeignKey(() => Dialog)
  @Column({ type: DataType.INTEGER, allowNull: true })
  dialogId: number;

  @ApiProperty({ example: "0", description: "ID of message user" })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @HasMany(() => Attachment, {
    foreignKey: "attachableId", scope: { attachableType: "message" },
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  attachments: Attachment[];

  @HasMany(() => Tag, {
    foreignKey: "taggableId", scope: { taggableType: "message" },
    constraints: true, onDelete: "set null", onUpdate: "cascade"
  })
  tags: Tag[];

  @BelongsTo(() => User)
  user: User;
}