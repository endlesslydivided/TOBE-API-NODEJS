import { forwardRef, Module } from "@nestjs/common";
import { AttachmentsController } from "./attachments.controller";
import { AttachmentsService } from "./attachments.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "./attachments.model";
import { Message } from "../messages/messages.model";
import { Post } from "../posts/posts.model";
import { FilesModule } from "../files/files.module";

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  imports:
    [
      SequelizeModule.forFeature([Message,Post,Attachment]),
      forwardRef(()=> FilesModule)
    ],
  exports:
    [
      AttachmentsService,
    ]
})
export class AttachmentsModule {}
