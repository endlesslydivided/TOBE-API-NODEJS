import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { Dialog } from "./dialogs.model";
import { CreateDialogDto } from "./dto/createDialog.dto";
import { UserDialog } from "./userDialogs.model";
import sequlize, { Op, Transaction } from "sequelize";
import { UpdateDialogDto } from "./dto/updateDialog.dto";
import { Message } from "../messages/messages.model";


@Injectable()
export class DialogsService {
  constructor(
    @InjectModel(Dialog) private dialogRepository: typeof Dialog,
    @InjectModel(UserDialog) private userDialogRepository: typeof UserDialog,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService) {
  }

  async createDialog(dto: CreateDialogDto, transaction: Transaction) {
    const user = await this.userService.getUserById(dto.creatorId);
    if (user) {
      const { name, isChat, creatorId, usersId } = dto;
      const dialog = this.dialogRepository.create({ name, isChat, creatorId }, { transaction });
      dialog.then((dialog) => {
        usersId.map(async (userId: number) => {
          return await this.userDialogRepository.create({
            dialogId: dialog.id,
            userId
          }, { transaction }).catch((error) => {
            throw new HttpException("Диалог не создан.", HttpStatus.INTERNAL_SERVER_ERROR);
          });
        });
      }).catch((error) => {
        throw new HttpException("Диалог не создан.", HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }
    throw new HttpException("Диалог не создан: пользователь не найден", HttpStatus.NOT_FOUND);
  }

  async updateDialog(id: number, dto: UpdateDialogDto) {
    const dialog = await this.dialogRepository.findByPk(id);
    if (dialog) {
      return await this.dialogRepository.update(dto, { where: { id } });
    }
    throw new HttpException("Диалог не найден", HttpStatus.NOT_FOUND);
  }

  async getAllDialogsByUser(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (user) {
      return await this.dialogRepository.findAll<any>(
        {
          include: { model: UserDialog, where: { userId } }
        });
    }
    throw new HttpException("Диалоги не найдены: пользователь не найден", HttpStatus.NOT_FOUND);
  }

  async getPagedDialogsByUser(userId: number, limit: number = 9, page: number = 0) {
    this.userService.getUserById(userId).catch((error) => {
      throw new HttpException("Диалоги не найдены: пользователь не найден", HttpStatus.NOT_FOUND);
    });

    const offset = page * limit - limit;
    return this.dialogRepository.findAndCountAll(
      {
        include:
          [
            { model: UserDialog, where: { userId }, attributes: ["createdAt"] },
            {
              model: Message, attributes: ["createdAt", "text", "userId"], where: {
                createdAt:
                  {
                    [Op.eq]: sequlize.fn("max", sequlize.col("createdAt"))
                  }
              }
            }
          ],
        limit, offset,
        order: [["createdAt", "DESC"]]
      }).then((result) => result)
      .catch((error) => {
        throw new HttpException("Диалоги не найдены", HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async getDialogById(id: number) {
    const dialog = await this.dialogRepository.findByPk(id);
    if (dialog) {
      return dialog;
    }
    throw new HttpException("Диалог не найден", HttpStatus.NOT_FOUND);
  }

  async deleteDialog(id: number) {
    const dialog = await this.dialogRepository.findByPk(id);
    if (dialog) {
      return await this.dialogRepository.destroy({ where: { id } });
    }
    throw new HttpException("Диалог для удаления не найден", HttpStatus.NOT_FOUND);
  }

}
