import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/createPost.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";

@Controller('posts')
export class PostsController {

  constructor(private postService:PostsService) {
  }

  @Post()
  @UseInterceptors(TransactionInterceptor,FilesInterceptor('files'))
  createPost(@Body() dto: CreatePostDto,
             @UploadedFiles() files,
             @TransactionParam() transaction: Transaction
  )
  {
      return this.postService.create(dto,files,transaction);
  }

}
