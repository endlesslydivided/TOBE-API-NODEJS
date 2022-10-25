import { forwardRef, Module } from "@nestjs/common";
import { AttachmentsService } from "./attachments.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "./attachments.model";
import { Message } from "../messages/messages.model";
import { Post } from "../posts/posts.model";
import { FilesModule } from "../files/files.module";
import { DialogsModule } from "../dialogs/dialogs.module";

@Module({
  controllers: [],
  providers: [AttachmentsService],
  imports:
    [
      SequelizeModule.forFeature([Message,Post,Attachment]),
      forwardRef(()=> FilesModule),
      forwardRef(()=> DialogsModule)
    ],
  exports:
    [
      AttachmentsService,
    ]
})
export class AttachmentsModule {}
