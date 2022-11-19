import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { Friend } from "./friends.model";
import { CreateFriendDto } from "./dto/createFriend.dto";
import { UpdateFriendDto } from "./dto/updateFriend.dto";

@Injectable()
export class FriendsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(Friend) private friendRepository: typeof Friend) {
  }

  async createFriend(dto: CreateFriendDto, transaction: Transaction) 
  {
    this.usersService.getUserById(dto.userId).catch(() => {
      throw new NotFoundException("Друг не добавлен: пользователь не найден");
    });

    const friend = await this.friendRepository.create(dto, { transaction });

    if (friend) 
    {
      return friend;
    }

    throw new HttpException("Друг не добавлен", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async updateFriend(id: number, dto: UpdateFriendDto, transaction: Transaction) 
  {
    const friend = await this.getFriendById(id);

    const newFriend = { ...friend, ...dto };

    this.friendRepository.update(newFriend, { where: { id }, transaction, returning: true }).catch(() => 
    {
      throw new InternalServerErrorException("Друг не обновлен");
    });

    if (newFriend.isRejected === null) 
    {
      const { friendId: userId, userId: friendId, isRejected } = dto;
      
      this.friendRepository.create(dto, { transaction }).then((friend) => friend).catch(() => 
      {
        throw new InternalServerErrorException("Друг не создан");
      });
    }
  }

  async deleteFriend(userId: number, friendId: number, transaction: Transaction) {
    const friend = await this.friendRepository.findOne({ where: { userId, friendId } });

    const affected = await this.friendRepository.destroy({ where: { userId }, transaction }).catch(() => {
      throw new InternalServerErrorException("Друг не удалён");
    });

    this.friendRepository.update({ isRejected: true }, { where: { userId }, transaction }).catch(() => {
      throw new InternalServerErrorException("Друг не удалён. Обновление записи не удалось");
    });

    return affected;
  }

  async getFriendById(id: number) 
  {
    const friend = await this.friendRepository.findByPk(id);
    if (friend) 
    {
      return friend;
    }
    throw new NotFoundException("Друг не найден");
  }

  async getPagedFriendsByUser(userId: number, limit: number = 9, page: number = 0) 
  {
    this.usersService.getUserById(userId).catch(() => 
    {
      throw new NotFoundException("Друзья не найдены: пользователь не найден");
    });

    const offset = page * limit - limit;
    return this.friendRepository.findAndCountAll(
      {
        limit, offset,
        where:
          {
            userId
          },
        order: [["createdAt", "DESC"]]
      })
      .then((result) => result)
      .catch((rror) => {
        throw new InternalServerErrorException("Друзья не найдены");
      });
  }

}
