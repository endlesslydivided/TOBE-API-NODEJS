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

    throw new InternalServerErrorException("Друг не добавлен");
  }

  async updateFriend(id: number, dto: UpdateFriendDto, transaction: Transaction) 
  {
    const friend = await this.getFriendById(id);

    const userId = friend.friendId;
    const friendId = friend.userId;

    this.friendRepository.update(dto, { where: { id }, transaction}).catch(() => 
    {
      throw new InternalServerErrorException("Друг не обновлен");
    });

    this.friendRepository.create({userId,friendId}, { transaction }).catch(() => 
    {
      throw new InternalServerErrorException("Друг не создан");
    });
  }

  async deleteFriend(id:number, transaction: Transaction) 
  {
    const friend = await this.friendRepository.findByPk(id);

    const affected = await this.friendRepository.destroy({where:{id:friend.id}, transaction }).catch(() => {
      throw new InternalServerErrorException("Друг не удалён");
    });

    this.friendRepository.update({ isRejected: null }, { where: { userId:friend.friendId, friendId:friend.userId }, transaction }).catch(() => {
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

  async getPagedFriendsByUser(userId: number, limit: number = 10, page: number = 1) 
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

  async getPagedRequestsByUser(userId: number, limit: number = 10, page: number = 1) 
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
            userId,
            isRejected: false
          },
        order: [["createdAt", "DESC"]]
      })
      .then((result) => result)
      .catch(() => {
        throw new InternalServerErrorException("Заявки не найдены");
      });
  }


  async getFriendsByUser(userId: number) 
  {
    this.usersService.getUserById(userId).catch(() => 
    {
      throw new NotFoundException("Друзья не найдены: пользователь не найден");
    });

    return this.friendRepository.findAndCountAll
    (
      {
        where:{userId},
        order: [["createdAt", "DESC"]]
      })
      .then((result) => result)
      .catch(() => {
        throw new InternalServerErrorException("Друзья не найдены");
      });
  }

}
