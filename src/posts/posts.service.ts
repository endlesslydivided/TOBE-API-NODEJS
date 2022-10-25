import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AttachmentsService } from "../attachments/attachments.service";
import { Post } from "./posts.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePostDto } from "./dto/createPost.dto";
import { Transaction } from "sequelize";
import { UsersService } from "../users/users.service";
import { Friend } from "../friends/friends.model";
import { TagsService } from "../tags/tags.service";
import { UpdatePostDto } from "./dto/updatePost.dto";

@Injectable()
export class PostsService {

  readonly ATTACHABLE_TYPE = 'post';

  constructor(private attachmentsService:AttachmentsService,
              private usersService: UsersService,
              private tagsService: TagsService,
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
    const {tags} = dto;

    if(post)
    {
      const attachments = await this.attachmentsService.createAttachments(files,this.ATTACHABLE_TYPE,post.id,transaction).catch((error) =>
      {
        throw new HttpException('Пост не создан: ошибка добавления прикреплений',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      const newTags = await this.tagsService.createTags(this.ATTACHABLE_TYPE,post.id,tags,transaction).catch((error) =>
      {
        throw new HttpException('Пост не создан: ошибка добавления тегов',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      return post;
    }

    throw new HttpException('Пост не создан',HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async update(id:number,dto: UpdatePostDto,files: any,transaction:Transaction)
  {
    this.postRepository.findByPk(id).catch((error) =>
    {
      throw new HttpException('Пост не найден',HttpStatus.NOT_FOUND);
    });
    const {title,description,content,userId,categoryId,newTags,oldTags, attachmentsIds} = dto;

    const post = await this.postRepository.update({ title,description,content,categoryId },{where: {id},transaction}).catch((error) =>
    {
      throw new HttpException('Пост не обновлен',HttpStatus.INTERNAL_SERVER_ERROR);
    });

    if(post)
    {
      const attachments = await this.attachmentsService.updateAttachments(attachmentsIds,files,this.ATTACHABLE_TYPE,id,transaction).catch((error) =>
      {
        throw new HttpException('Пост не обновлен: ошибка изменения прикреплений. Ошибка на стороне сервера.',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      const tagsResult = await this.tagsService.updateTags(oldTags,newTags,this.ATTACHABLE_TYPE,id,transaction).catch((error) =>
      {
        throw new HttpException('Пост не обновлен: ошибка изменения тегов. Ошибка на стороне сервера.',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      return post;
    }

    throw new HttpException('Пост не создан',HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async getById(id:number)
  {
    const post = await this.postRepository.findByPk(id);
    if(post)
    {
      return post;
    }
    throw new HttpException('Пост не найден',HttpStatus.NOT_FOUND);
  }

  async getPagedByUser(userId:number, limit :number = 9,page:number = 0)
  {
    this.usersService.getUserById(userId).catch((error) =>
    {
      throw new HttpException('Посты не найдены: пользователь не найден',HttpStatus.NOT_FOUND);
    });

    const offset = page * limit - limit;
    return this.postRepository.findAndCountAll(
      {
        limit,offset,
        where:
          {
            userId
          },
        order:[['createdAt','DESC']]
      }).then((result) =>  result)
      .catch((error)=>
      {
        throw new HttpException('Посты не найдены',HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

  async getPagedByUserSubscriptions(userId:number, limit :number = 9,page:number = 0)
  {
    this.usersService.getUserById(userId).catch((error) =>
    {
      throw new HttpException('Посты не найдены: пользователь не найден',HttpStatus.NOT_FOUND);
    });

    const offset = page * limit - limit;
    return this.postRepository.findAndCountAll(
      {
        include: {model: Friend, where:{userId}},
        limit,offset,
        order:[['createdAt','DESC']]
      }).then((result) =>  result)
      .catch((error)=>
      {
        throw new HttpException('Посты не найдены',HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

  async delete(id:number)
  {
      return await this.postRepository.destroy({where :{id}});
  }
}
