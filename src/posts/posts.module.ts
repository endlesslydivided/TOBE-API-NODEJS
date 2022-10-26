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
import { UsersModule } from "../users/users.module";
import { TagsModule } from "../tags/tags.module";

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports:
    [
      SequelizeModule.forFeature([Post, User, Attachment, Category, Tag]),
      forwardRef(() => AttachmentsModule),
      forwardRef(() => UsersModule),
      forwardRef(() => TagsModule)

    ],
  exports:
    [
      PostsService
    ]
})
export class PostsModule {
}
