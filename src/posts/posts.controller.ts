import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/createPost.dto";

@Controller('posts')
export class PostsController {

  constructor(private postService:PostsService) {
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  createPost(@Body() dto: CreatePostDto,
             @UploadedFiles() files)
  {
      return this.postService.createPost(dto,files);
  }

}
