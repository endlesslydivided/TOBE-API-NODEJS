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

@ApiTags("Posts")
@Controller("posts")
export class PostsController {

  constructor(private postService: PostsService) {
  }

  @ApiOperation({ summary: "Create photo" })
  @ApiCreatedResponse({ type: Photo })
  @UseInterceptors(TransactionInterceptor, FilesInterceptor("files"))
  @Post()
  createPost(@Body() dto: CreatePostDto,
             @UploadedFiles() files,
             @TransactionParam() transaction: Transaction
  ) {
    return this.postService.createPost(dto, files, transaction);
  }

  @ApiOperation({ summary: "Update photo" })
  @ApiOkResponse()
  @UseInterceptors(TransactionInterceptor, FilesInterceptor("files"))
  @Put("/:id")
  updatePost(@Param("id") id: number,
             @Body() dto: UpdatePostDto,
             @TransactionParam() transaction: Transaction,
             @UploadedFiles() files) {
    return this.postService.updatePost(id, dto, files, transaction);
  }

  @ApiOperation({ summary: "Delete photo" })
  @ApiNoContentResponse()
  @Delete("/:id")
  deletePost(@Param("id") id: number) {
    return this.postService.deletePost(id);
  }

  @ApiOperation({ summary: "Get one photo" })
  @ApiOkResponse({ type: Post })
  @Get("/:id")
  getOnePost(@Param("id") id: number) {
    return this.postService.getPostsById(id);
  }

}
