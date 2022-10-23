import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AttachmentsService } from "../attachments/attachments.service";
import { async } from "rxjs";
import { Model } from "sequelize-typescript";
import { Post } from "./posts.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePostDto } from "./dto/createPost.dto";
import { Attachment } from "../attachments/attachments.model";

@Injectable()
export class PostsService {

  readonly ATTACHABLE_TYPE = 'post';

  constructor(private attachmentService:AttachmentsService,
              @InjectModel(Post)private postRepository:typeof Post)
{
  }

  async createPost(dto: CreatePostDto,files: any)
  {
    const post = await this.postRepository.create(dto);
    const attachments = this.attachmentService.createAttachment(files,this.ATTACHABLE_TYPE,post.id);
    if(post)
    {
      const attachments = this.attachmentService.createAttachment(files,this.ATTACHABLE_TYPE,post.id);
      if(attachments)
      {
        return post;
      }
      await this.postRepository.destroy({where:{id: post.id}});
      throw new HttpException('Пост не создан',HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Пост не создан',HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
