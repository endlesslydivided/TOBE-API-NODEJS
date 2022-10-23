import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Message } from "./messages.model";
import { Dialog } from "../dialogs/dialogs.model";
import { User } from "../users/users.model";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { Attachment } from "../attachments/attachments.model";
import { Tag } from "../tags/tags.model";

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  imports:
    [
      SequelizeModule.forFeature([Message,Dialog,Attachment,Tag,User])
    ],
  exports:
    [
      MessagesService,
    ]})
export class MessagesModule {}
