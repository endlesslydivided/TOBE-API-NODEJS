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
     
    const dialogsUsersIds = [...usersId,creatorId];
    const usersDialogs = await this.userDialogRepository.findAll({where:{userId: {[Op.in]: dialogsUsersIds}}});
    let dialogResult = {};
    if(usersDialogs.length === dialogsUsersIds.length+ 1)
    {
      let dialogId = usersDialogs[0].id;
      dialogResult['dialog'] = await this.dialogRepository.findOne({where:{id:dialogId}});
      dialogResult['created'] = false;
    }
    else
    {
      dialogResult['dialog'] = await this.dialogRepository.create({name, isChat, creatorId});     
      await dialogResult['dialog'].$set('users',[...usersId,creatorId],{transaction}).catch((error) => {
        throw new InternalServerErrorException("Диалог не создан.");
      });
      dialogResult['created'] = true;
    }

   
    return dialogResult;
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

    const userDialogsId = (await this.userDialogRepository.findAll({where: {userId},attributes:["dialogId"]})).map(x=> x.dialogId)
    const dialogs = await this.dialogRepository.findAndCountAll(
      {
        include:
          [
            { 
              model:User,attributes:["id","createdAt","firstName","lastName"],where:{id: {[Op.ne]: userId}},include:[{model:Photo}]
            },
            {
              model: Message, attributes: ["createdAt", "text", "userId"],order:[["createdAt", "DESC"]], limit: 1
            }
          ],
        where:
        {
          id: {[Op.in]: userDialogsId}
        },
        limit: filters.limit,
        offset: filters.page *  filters.limit -  filters.limit,
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
        throw new InternalServerErrorException("Диалоги не найдены");
      });
    return dialogs;
  }

  async getDialogById(id: number) 
  {
    const dialog = await this.dialogRepository.findByPk(id,{include: {model: User, attributes:['id','firstName','lastName'],include:[Photo]}});
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
