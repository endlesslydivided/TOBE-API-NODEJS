import { AfterFind, BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { Post } from "../posts/posts.model";
import { Message } from "../messages/messages.model";
import { ApiProperty } from "@nestjs/swagger";

interface AttachmentCreationAttribute {
  path: string;
  order: number;
  attachableId: number;
  attachableType: string;
}

@Table({ tableName: "attachments", timestamps: false })
export class Attachment extends Model<Attachment, AttachmentCreationAttribute> {
  @ApiProperty({ example: "0", description: "Unique tag identifier" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "./attachment/1.png", description: "Attachment path on server" })
  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @ApiProperty({ example: "0", description: "Order number of an attachment" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @ApiProperty({ example: "0", description: "Attachment using entry id" })
  @Column({ type: DataType.INTEGER, allowNull: true })
  attachableId: number;

  @ApiProperty({ example: "0", description: "Attachment using entry type" })
  @Column({ type: DataType.STRING, allowNull: false })
  attachableType: string;

  async getAttachable(options) {
    if (!this.attachableType) {
      return Promise.resolve(null);
    }
    const mixinMethodName = `get${this.upperCaseFirst(this.attachableType)}`;
    return this[mixinMethodName](options);
  }

  upperCaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;

  @AfterFind
  public static attachmentAfterFind(findResult: any) {
    if (!Array.isArray(findResult)) {
      findResult = [findResult];
    }
    for (const instance of findResult) {
      if (instance.attachableType === "post" && instance.post !== undefined) {
        instance.attachable = instance.post;
      } else if (instance.attachableType === "message" && instance.message !== undefined) {
        instance.attachable = instance.message;
      }
      // To prevent mistakes:
      delete instance.post;
      delete instance.dataValues.post;
      delete instance.message;
      delete instance.dataValues.message;
    }
  }

  @BelongsTo(() => Post, {
    foreignKey: "attachableId",
    targetKey: "id",
    constraints: true,
    onDelete: "set null",
    onUpdate: "cascade"
  })
  post: Post;

  @BelongsTo(() => Message, {
    foreignKey: "attachableId",
    targetKey: "id",
    constraints: true,
    onDelete: "set null",
    onUpdate: "cascade"
  })
  message: Message;

}