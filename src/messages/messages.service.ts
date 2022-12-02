import { forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { Transaction } from "sequelize";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { DialogsService } from "../dialogs/dialogs.service";
import { AttachmentsService } from "../attachments/attachments.service";
import { Message } from "./messages.model";
import { UpdateMessageDto } from "./dto/updateMessage.dto";
import { TagsService } from "../tags/tags.service";
import { FilterMessageParams } from "src/requestFeatures/filterMessageParams";
import { Dialog } from "src/dialogs/dialogs.model";
import { User } from "src/users/users.model";
import { Photo } from "src/photos/photos.model";
import { Op } from "sequelize";
import sequelize from "sequelize";

@Injectable()
export class MessagesService {

  readonly ANYABLE_TYPE = "message";

  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @Inject(forwardRef(() => AttachmentsService)) private attachmentsService: AttachmentsService,
    @Inject(forwardRef(() => DialogsService)) private dialogsService: DialogsService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => TagsService)) private tagsService: TagsService) {
  }

  async createMessage(dto: CreateMessageDto, transaction: Transaction)  //, files: any
  { 
    const user = await this.usersService.getUserById(dto.userId).catch((error) => 
    {
      throw new InternalServerErrorException("Сообщение не отправлено.Ошибка на стороне сервера");
    });

    if(!user) throw new NotFoundException("Сообщение не отправлено: пользователь не найден");

    const dialog = await this.dialogsService.getDialogById(dto.dialogId).catch((error) => 
    {
      throw new InternalServerErrorException("Сообщение не отправлено.Ошибка на стороне сервера");
    });

    if(!dialog) throw new NotFoundException("Сообщение не отправлено: диалог не найден");


    const { text, dialogId, userId, tags } = dto;
    const message =  this.messageRepository.create({ text, dialogId, userId }, { transaction, returning:true});
    return message.then(async (resultMessage) =>
    {
      const tagsPromise =  this.tagsService.createTags(this.ANYABLE_TYPE, resultMessage?.id, tags, transaction).catch((error) =>
      {
        throw new InternalServerErrorException("Сообщение не отправлено: ошибка добавления тегов");
      });

      return tagsPromise.then(() =>  resultMessage);                 
    })
    .catch((error) => 
    {
      throw new InternalServerErrorException("Сообщение не отправлено: ошибка на стороне сервера.");
    });
    
        // .then(async (resultMessage) =>
    // {
    //   const attachmentsPromise = this.attachmentsService.createAttachments(files, this.ANYABLE_TYPE, resultMessage.id, transaction).catch((error) =>
    //   {
    //     throw new InternalServerErrorException("Сообщение не отправлено: ошибка добавления прикреплений");
    //   });  

    //   return attachmentsPromise.then(() =>  resultMessage);                 
    // })
  }

  async updateMessage(id: number, dto: UpdateMessageDto, transaction: Transaction, files: any) {
    this.messageRepository.findByPk(id).catch((error) => {
      throw new HttpException("Сообщение не найдено", HttpStatus.NOT_FOUND);
    });

    const { text, attachmentsIds, newTags, oldTags } = dto;
    const message = await this.messageRepository.update({ text }, { where: { id }, transaction }).catch((error) => {
      throw new HttpException("Сообщение не обновлено", HttpStatus.INTERNAL_SERVER_ERROR);
    });

    if (message) {
      const attachments = await this.attachmentsService.updateAttachments(attachmentsIds, files, this.ANYABLE_TYPE, id, transaction).catch((error) => {
        throw new HttpException("Сообщение не изменено: ошибка изменения прикреплений. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
      });

      const tagsResult = await this.tagsService.updateTags(oldTags, newTags, this.ANYABLE_TYPE, id, transaction).catch((error) => {
        throw new HttpException("Сообщение не изменено: ошибка изменения тегов. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return message;
    }
    throw new HttpException("Сообщение не изменено. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async getAllMessageByDialog(dialogId: number) {
    const dialog = await this.dialogsService.getDialogById(dialogId);
    if (dialogId) {
      return await this.messageRepository.findAll({ where: { dialogId }, order: [["createdAt", "DESC"]] });
    }
    throw new HttpException("Сообщения не найдены: диалог не существует", HttpStatus.NOT_FOUND);
  }

  async getPagedMessagesByDialog(dialogId: number, filters:FilterMessageParams) {
    
    const dialog = await this.dialogsService.getDialogById(dialogId).catch((error) => 
    {
      throw new InternalServerErrorException("Сообщения не найдены.Ошибка на стороне сервера");
    });

    if(!dialog) throw new NotFoundException("Сообщения не найдены: диалог не найден");

    let whereClause = 
    {
      [Op.and]:
      [
        sequelize.where(sequelize.col('dialogId'),{[Op.eq] : dialogId })
      ]
    }

    if(filters.lastDate)
    {
      whereClause[Op.and].push(sequelize.where(sequelize.col(`"Message"."createdAt"`),{[Op.lt] : filters.lastDate }));
    }
    const messages = await this.messageRepository.findAndCountAll({
      where: whereClause,
      include:[{model: User,include:[{model:Photo}]}],
      limit: filters.limit,
      order: [["createdAt", "DESC"]]
    }).catch((error) =>
    {
      throw new InternalServerErrorException("Сообщения не найдены.Ошибка на стороне сервера");
    });
    return messages;
  }

  async getOneMessage(id: number) 
  { 
    return await this.messageRepository.findByPk(id,{include:[{model: User}]});
  }

  async deleteMessage(id: number) 
  {
    const message = await this.messageRepository.findByPk(id);
    if(!message) throw new NotFoundException("Сообщение не найдено: диалог не найден");
    return await this.messageRepository.destroy({ where: { id } });
  }
}
