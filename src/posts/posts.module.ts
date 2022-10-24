import { forwardRef, Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Tag } from "../tags/tags.model";
import { Attachment } from "../attachments/attachments.model";
import { Category } from "../category/category.model";
import { Post } from "./posts.model";
import { AttachmentsModule } from "../attachments/attachments.module";

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports:
    [
      SequelizeModule.forFeature([Post,User,Attachment,Category,Tag]),
      forwardRef(()=> AttachmentsModule),


    ],
  exports:
    [
      PostsService,
    ]
})
export class PostsModule {}
