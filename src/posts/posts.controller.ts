import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/createPost.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Photo } from "../photos/photos.model";
import { FormDataRequest } from "nestjs-form-data";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {

  constructor(private postService: PostsService) {
  }

  @ApiOperation({ summary: "Create post" })
  @ApiCreatedResponse({ type: Photo })
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest()
  @Post()
  createPost(@Body() dto: CreatePostDto,
             @TransactionParam() transaction: Transaction
  ) {
    return this.postService.createPost(dto,transaction);
  }

  @ApiOperation({ summary: "Update post" })
  @ApiOkResponse()
  @UseInterceptors(TransactionInterceptor, FilesInterceptor("files"))
  @Put("/:id")
  updatePost(@Param("id") id: number,
             @Body() dto: UpdatePostDto,
             @TransactionParam() transaction: Transaction,
             @UploadedFiles() files) {
    return this.postService.updatePost(id, dto, files, transaction);
  }

  @ApiOperation({ summary: "Delete post" })
  @ApiNoContentResponse()
  @Delete("/:id")
  deletePost(@Param("id") id: number) {
    return this.postService.deletePost(id);
  }

  @ApiOperation({ summary: "Get one post" })
  @ApiOkResponse({ type: Post })
  @Get("/:id")
  getOnePost(@Param("id") id: number) {
    return this.postService.getPostsById(id);
  }

}
