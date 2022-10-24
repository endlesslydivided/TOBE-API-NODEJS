import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { UpdateAlbumDto } from "../albums/dto/updateAlbum.dto";
import { Dialog } from "./dialogs.model";
import { CreateDialogDto } from "./dto/createDialog.dto";
import { UserDialog } from "./userDialogs.model";
import { Album } from "../albums/albums.model";
import { map } from "rxjs";
import { Transaction, Op } from "sequelize";
import { UpdateDialogDto } from "./dto/updateDialog.dto";
import { Message } from "../messages/messages.model";


@Injectable()
export class DialogsService {
  constructor(
    @InjectModel(Dialog) private dialogRepository:typeof Dialog,
    @InjectModel(UserDialog) private userDialogRepository:typeof UserDialog,
    private userService:UsersService)
  {  }

  async create(dto: CreateDialogDto,transaction:Transaction)
  {
    const user = await this.userService.getUserById(dto.creatorId);
    if(user)
    {
      const {name,isChat,creatorId,usersId} = dto;
      const dialog = this.dialogRepository.create({name,isChat,creatorId},{transaction});
      dialog.then((dialog) =>
      {
        usersId.map(async (userId: number) =>
        {
          return await this.userDialogRepository.create({dialogId: dialog.id,userId}, {transaction}).catch((error) =>
          {
            throw new HttpException('Диалог не создан.',HttpStatus.INTERNAL_SERVER_ERROR);
          })
        })
      }).catch((error) =>
      {
        throw new HttpException('Диалог не создан.',HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }
    throw new HttpException('Диалог не создан: пользователь не найден',HttpStatus.NOT_FOUND);
  }

  async update(id:number,dto: UpdateDialogDto)
  {
    const dialog = await this.dialogRepository.findByPk(id);
    if(dialog)
    {
      return await this.dialogRepository.update(dto,{where: {id}});
    }
    throw new HttpException('Диалог не найден',HttpStatus.NOT_FOUND);
  }

  async getAllByUser(userId:number)
  {
    const user = await this.userService.getUserById(userId);
    if(user)
    {
      return await this.dialogRepository.findAll<any>(
        {
                  include: {model:UserDialog,where:{userId}}
              });
    }
    throw new HttpException('Диалоги не найдены: пользователь не найден',HttpStatus.NOT_FOUND);
  }

  async getById(id:number)
  {
    const dialog = await this.dialogRepository.findByPk(id);
    if(dialog)
    {
      return dialog;
    }
    throw new HttpException('Диалог не найден',HttpStatus.NOT_FOUND);
  }

  async delete(id:number)
  {
    const dialog = await this.dialogRepository.findByPk(id);
    if(dialog)
    {
      return await this.dialogRepository.destroy({where :{id}});
    }
    throw new HttpException('Диалог для удаления не найден',HttpStatus.NOT_FOUND);
  }

}
