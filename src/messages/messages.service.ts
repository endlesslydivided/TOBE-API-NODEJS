import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { Transaction } from "sequelize";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { DialogsService } from "../dialogs/dialogs.service";
import { AttachmentsService } from "../attachments/attachments.service";
import { Message } from "./messages.model";
import { UpdateMessageDto } from "./dto/updateMessage.dto";
import { TagsService } from "../tags/tags.service";

@Injectable()
export class MessagesService {

  readonly ATTACHABLE_TYPE = 'message';

  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    private attachmentsService:AttachmentsService,
    private dialogsService:DialogsService,
    private usersService:UsersService,
    private tagsService:TagsService)
  {  }

  async create(dto: CreateMessageDto,transaction:Transaction,files: any)
  {
    this.usersService.getUserById(dto.userId).catch((error) =>
    {
      throw new HttpException('Сообщение не оправлено: отправитель не найден',HttpStatus.NOT_FOUND);
    });
    const {text,dialogId,userId,tags} = dto;
    const message = await this.messageRepository.create({text,dialogId,userId},{transaction});

    if(message)
    {
      const attachments = await this.attachmentsService.createAttachments(files,this.ATTACHABLE_TYPE,message.id,transaction).catch((error) =>
      {
        throw new HttpException('Сообщение не оправлено: ошибка добавления прикреплений',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      const newTags = await this.tagsService.createTags(this.ATTACHABLE_TYPE,message.id,tags,transaction).catch((error) =>
      {
        throw new HttpException('Сообщение не оправлено: ошибка добавления тегов',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      return message;
    }
    throw new HttpException('Сообщение не оправлено: ошибка создания экземпляра сообщений',HttpStatus.INTERNAL_SERVER_ERROR);

  }

  //TODO Изменить контроллер message,post,dialog,photos
  //TODO Изменить сервис photos
  //TODO Изменить контроллеры на добавление кодов сообщений
  //TODO Добавить аттрибуты валидации к моделям и DTO :

  async update(id:number,dto: UpdateMessageDto,transaction:Transaction,files: any)
  {
    this.messageRepository.findByPk(id).catch((error) =>
    {
      throw new HttpException('Сообщение не найдено',HttpStatus.NOT_FOUND);
    });

    const {text,attachmentsIds,newTags,oldTags} = dto;
    const message =  await this.messageRepository.update({ text },{where: {id},transaction}).catch((error) =>
    {
      throw new HttpException('Сообщение не обновлено',HttpStatus.INTERNAL_SERVER_ERROR);
    });

    if(message)
    {
      const attachments = await this.attachmentsService.updateAttachments(attachmentsIds,files,this.ATTACHABLE_TYPE,id,transaction).catch((error) =>
      {
        throw new HttpException('Сообщение не изменено: ошибка изменения прикреплений. Ошибка на стороне сервера.',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      const tagsResult = await this.tagsService.updateTags(oldTags,newTags,this.ATTACHABLE_TYPE,id,transaction).catch((error) =>
      {
        throw new HttpException('Сообщение не изменено: ошибка изменения тегов. Ошибка на стороне сервера.',HttpStatus.INTERNAL_SERVER_ERROR);
      })

      return message;
    }
    throw new HttpException('Сообщение не изменено. Ошибка на стороне сервера.',HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async getAllByDialog(dialogId:number)
  {
    const dialog = await this.dialogsService.getById(dialogId);
    if(dialogId)
    {
      return await this.messageRepository.findAll({where:{dialogId},order:[['createdAt','DESC']]});
    }
    throw new HttpException('Сообщения не найдены: диалог не существует',HttpStatus.NOT_FOUND);
  }

  async getPagedByDialog(dialogId:number,limit :number = 9,page:number = 0)
  {
    const dialog = await this.dialogsService.getById(dialogId);
    const offset = page * limit - limit;
    if(dialog)
    {
      return await this.messageRepository.findAndCountAll({where:{dialogId},limit,offset,order:[['createdAt','DESC']]});

    }
    throw new HttpException('Сообщения не найдены: диалог не существует',HttpStatus.NOT_FOUND);
  }

  async delete(dialogId:number)
  {
    const dialog = await this.dialogsService.getById(dialogId);
    if(dialog)
    {
      return await this.messageRepository.destroy({where :{dialogId}});
    }
    throw new HttpException('Сообщения не найдены: диалог не существует',HttpStatus.NOT_FOUND);
  }
}
