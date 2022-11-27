import { forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AttachmentsService } from "../attachments/attachments.service";
import { Post } from "./posts.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePostDto } from "./dto/createPost.dto";
import { Transaction } from "sequelize";
import { UsersService } from "../users/users.service";
import { Friend } from "../friends/friends.model";
import { TagsService } from "../tags/tags.service";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { FilterFeedParams } from "src/requestFeatures/filterFeedParams";
import { User } from "src/users/users.model";
import { Attachment } from "src/attachments/attachments.model";
import { resolve } from "path";
import { Op } from "sequelize";
import { Photo } from "src/photos/photos.model";

@Injectable()
export class PostsService {

  readonly ANYABLE_TYPE = "post";

  constructor(@Inject(forwardRef(() => AttachmentsService)) private attachmentsService: AttachmentsService,
              @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
              @Inject(forwardRef(() => TagsService)) private tagsService: TagsService,
              @InjectModel(Post) private postRepository: typeof Post) {
  }

  async createPost(dto: CreatePostDto, transaction: Transaction) 
  { 
    const user = await this.usersService.getUserById(dto.userId).catch((error) => 
    {
      throw new InternalServerErrorException("Пост не создан.Ошибка на стороне сервера");
    });

    if(!user) throw new NotFoundException("Пост не создан: пользователь не найден");

    const post =  this.postRepository.create(dto, { transaction });
    const { tags,files } = dto;

    return post.then(async (resultPost) =>
    {
      const attachmentsPromise = this.attachmentsService.createAttachments(files, this.ANYABLE_TYPE, resultPost.id, transaction).catch((error) =>
      {
        throw new InternalServerErrorException("Пост не создан: ошибка добавления прикреплений");
      });  

      return attachmentsPromise.then(() =>  resultPost);                 
    })
    .then((resultPost) =>
    {
      const tagsPromise =  this.tagsService.createTags(this.ANYABLE_TYPE, resultPost?.id, tags, transaction).catch((error) =>
      {
        throw new InternalServerErrorException("Пост не создан: ошибка добавления тегов");
      });

      return tagsPromise.then(() =>  resultPost);                 
    })
    .catch((error) => 
    {
      throw new InternalServerErrorException("Пост не создан: ошибка на стороне сервера.");
    });   

  }

  async updatePost(id: number, dto: UpdatePostDto, files: any, transaction: Transaction) 
  {
    const findedPost = await this.postRepository.findByPk(id).catch((error) => {
      throw new HttpException("Пост не найден", HttpStatus.NOT_FOUND);
    });
    const { title, description, content, userId, categoryId, newTags, oldTags, attachmentsIds } = dto;

    const post = await this.postRepository.update({ title, description, content, categoryId }, {
      where: { id },
      transaction
    }).catch((error) => {
      throw new HttpException("Пост не обновлен", HttpStatus.INTERNAL_SERVER_ERROR);
    });

    if (post) {
      const attachments = await this.attachmentsService.updateAttachments(attachmentsIds, files, this.ANYABLE_TYPE, id, transaction).catch((error) => {
        throw new HttpException("Пост не обновлен: ошибка изменения прикреплений. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
      });

      const tagsResult = await this.tagsService.updateTags(oldTags, newTags, this.ANYABLE_TYPE, id, transaction).catch((error) => {
        throw new HttpException("Пост не обновлен: ошибка изменения тегов. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return post;
    }

    throw new HttpException("Пост не создан", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async getPostsById(id: number) {
    const post = await this.postRepository.findByPk(id);
    if (post) {
      return post;
    }
    throw new HttpException("Пост не найден", HttpStatus.NOT_FOUND);
  }

  async getPagedPostByUser(userId: number, limit: number = 9, page: number = 0) {
    this.usersService.getUserById(userId).catch((error) => {
      throw new InternalServerErrorException("Посты не найдены. Ошибка на стороне сервера.");
    });

    const offset = page * limit - limit;
    return this.postRepository.findAndCountAll(
      {
        limit, offset,
        where:
          {
            userId
          },
        order: [["createdAt", "DESC"]]
      }).then((result) => result)
      .catch((error) => {
        throw new InternalServerErrorException("Посты не найдены. Ошибка на стороне сервера.");
      });
  }

  async getPagedPostByUserSubscriptions(userId: number, filters:FilterFeedParams) 
  {
    const user = await this.usersService.getUserById(userId).catch((error) => {
      throw new InternalServerErrorException("Посты не найдены.Ошибка на стороне сервера.");
    });

    if(!user) throw new NotFoundException("Посты не найдены. Пользователь не найден");


    const friendsIds = user.friends.map(x => x.friendId);

    return await this.postRepository.findAndCountAll(
      {
        include: 
        [{
          model: Attachment,
        },
        {
          model: User,
          include:
          [
            {model:Photo}
          ]
        }],
        where: { 
          userId: 
          {[Op.or]:
            {
              [Op.in] : friendsIds,
              [Op.eq] : userId
            }
            
          } },
        limit: filters.limit,
        offset: filters.offset,
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
        throw new InternalServerErrorException("Посты не найдены");
      });
  }

  async deletePost(id: number) {
    return await this.postRepository.destroy({ where: { id } });
  }
}
