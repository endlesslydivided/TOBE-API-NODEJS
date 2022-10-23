import { Module } from "@nestjs/common";
import { AttachmentsService } from "../attachments/attachments.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "../posts/posts.model";
import { CategoryService } from "./category.service";
import { Category } from "./category.model";

@Module({

  providers: [CategoryService],
  imports:
    [
      SequelizeModule.forFeature([Category,Post])
    ],
  exports:
    [
      CategoryService,
    ]
})
export class CategoryModule {}
