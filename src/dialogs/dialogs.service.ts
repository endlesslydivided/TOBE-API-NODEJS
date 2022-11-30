import { forwardRef, HttpException,NotFoundException,  HttpStatus,InternalServerErrorException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { Dialog } from "./dialogs.model";
import { CreateDialogDto } from "./dto/createDialog.dto";
import { UserDialog } from "./userDialogs.model";
import sequlize, { Op, Transaction } from "sequelize";
import { UpdateDialogDto } from "./dto/updateDialog.dto";
import { Message } from "../messages/messages.model";
import { FilterFeedParams } from "src/requestFeatures/filterFeedParams";
import { FilterDialogParams } from "src/requestFeatures/filterDialogParams";
import { User } from "src/users/users.model";
import { Photo } from "src/photos/photos.model";


@Injectable()
export class DialogsService {
  constructor(
    @InjectModel(Dialog) private dialogRepository: typeof Dialog,
    @InjectModel(UserDialog) private userDialogRepository: typeof UserDialog,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
  }
  async createDialog(dto: CreateDialogDto, transaction: Transaction) 
  {
    const user = await this.usersService.getUserById(dto.creatorId).catch((error) => 
    {
      throw new InternalServerErrorException("Сообщение не отправлено.Ошибка на стороне сервера");
    });

    if(!user) throw new NotFoundException("Сообщение не отправлено: пользователь не найден");

    const { name, isChat, creatorId, usersId } = dto;
    
    const dialog = await this.dialogRepository.findOrCreate(
      {where:{ name, isChat, creatorId },defaults:{ name, isChat, creatorId },transaction,returning:true});
    
    if(dialog[1])
    {
      await dialog[0].$set('users',[...usersId,creatorId],{transaction}).catch((error) => {
        throw new InternalServerErrorException("Диалог не создан.");
      });
    }
  
   
    return dialog[0];
  }

  async updateDialog(id: number, dto: UpdateDialogDto) 
  {
    const dialog = await this.dialogRepository.findByPk(id);

    if(!dialog) throw new NotFoundException("Диалог не найден");
    return await this.dialogRepository.update(dto, { where: { id } });
    
  }

  async getAllDialogsByUser(userId: number) 
  {
    const user = await this.usersService.getUserById(userId);

    if(!user) throw new NotFoundException("Диалоги не найдены: пользователь не найден");

    return await this.dialogRepository.findAll<any>(
      {
        include: { model: UserDialog, where: { userId } }
      });
    
  }

  async getPagedDialogsByUser(userId: number, filters: FilterDialogParams) 
  {
    const user = await this.usersService.getUserById(userId);

    if(!user) throw new NotFoundException("Диалоги не найдены: пользователь не найден");

    return this.dialogRepository.findAndCountAll(
      {
        include:
          [
            { model: User, where: {id: {[Op.ne] : userId} }, attributes: ["createdAt","firstName","lastName"],
              include:[{model:Photo}] },
            {
              model: Message, attributes: ["createdAt", "text", "userId"], limit: 1
            }
          ],
        limit: filters.limit,
        offset: filters.page *  filters.limit -  filters.limit,
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
        throw new InternalServerErrorException("Диалоги не найдены");
      });
  }

  async getDialogById(id: number) 
  {
    const dialog = await this.dialogRepository.findByPk(id);
    if(!dialog) throw new NotFoundException("Диалог не найден");
    return dialog;
  }

  async deleteDialog(id: number) 
  {
    const dialog = await this.dialogRepository.findByPk(id);
    if(!dialog) throw new NotFoundException("Диалог не найден");
    return await this.dialogRepository.destroy({ where: { id } });
  }
}
