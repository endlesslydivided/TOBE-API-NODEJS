import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Message } from "./messages.model";
import { Dialog } from "../dialogs/dialogs.model";
import { User } from "../users/users.model";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { Attachment } from "../attachments/attachments.model";
import { Tag } from "../tags/tags.model";
import { UsersModule } from "../users/users.module";
import { DialogsModule } from "../dialogs/dialogs.module";
import { AttachmentsService } from "../attachments/attachments.service";
import { TagsService } from "../tags/tags.service";

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  imports:
    [
      SequelizeModule.forFeature([Message,Dialog,Attachment,Tag,User]),
      forwardRef(() => UsersModule),
      forwardRef(() => DialogsModule),
      forwardRef(() => AttachmentsService),
      forwardRef(() => TagsService)
    ],
  exports:
    [
      MessagesService,
    ]})
export class MessagesModule {}
