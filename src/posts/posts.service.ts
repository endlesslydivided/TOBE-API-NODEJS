import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AttachmentsService } from "../attachments/attachments.service";
import { async } from "rxjs";
import { Model } from "sequelize-typescript";
import { Post } from "./posts.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePostDto } from "./dto/createPost.dto";
import { Attachment } from "../attachments/attachments.model";
import { Transaction } from "sequelize";
import { UsersService } from "../users/users.service";

@Injectable()
export class PostsService {

  readonly ATTACHABLE_TYPE = 'post';

  constructor(private attachmentService:AttachmentsService,
              private usersService: UsersService,
              @InjectModel(Post)private postRepository:typeof Post)
{
  }

  async create(dto: CreatePostDto,files: any,transaction:Transaction)
  {
    this.usersService.getUserById(dto.userId).catch((error) =>
    {
      throw new HttpException('Пост не создан: пользователь не найден',HttpStatus.NOT_FOUND);
    });

    const post = await this.postRepository.create(dto,{transaction});

    if(post)
    {
      const attachments = await this.attachmentService.createAttachments(files,this.ATTACHABLE_TYPE,post.id,transaction).catch((error) =>
      {
        throw new HttpException('Пост не создан: ошибка добавления прикреплений',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      return post;
    }

    throw new HttpException('Пост не создан',HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
