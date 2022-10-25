import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "../posts/posts.model";
import { Tag } from "./tags.model";
import { Message } from "../messages/messages.model";
import { Photo } from "../photos/photos.model";

@Module({
  providers: [TagsService],
  controllers: [],
  imports:
    [
      SequelizeModule.forFeature([Post,Message,Photo,Tag])
    ],
  exports:
    [
      TagsService,
    ]
})
export class TagsModule {}
