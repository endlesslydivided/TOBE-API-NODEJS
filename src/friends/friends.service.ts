import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

              @InjectModel(Friend)private friendRepository:typeof Friend)
  {
  }

  async create(dto: CreateFriendDto,transaction:Transaction)
  {
    this.usersService.getUserById(dto.userId).catch((error) =>
    {
      throw new HttpException('Друг не добавлен: пользователь не найден',HttpStatus.NOT_FOUND);
    });

    const friend = await this.friendRepository.create(dto ,{transaction});

    if(friend)
    {
      return friend;
    }

    throw new HttpException('Друг не добавлен',HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async update(id:number,dto: UpdateFriendDto,transaction:Transaction)
  {
    const friend = await this.getById(id);
    const newFriend = {...friend, ...dto};
    this.friendRepository.update(newFriend,{where: {id},transaction,returning:true}).catch((error) =>
    {
      throw new HttpException('Друг не обновлен',HttpStatus.INTERNAL_SERVER_ERROR);
    });
    if(newFriend.isRejected === null)
    {
      const {friendId: userId, userId: friendId, isRejected} = dto;
      this.friendRepository.create(dto ,{transaction}).then((friend) => friend).catch((error) =>
      {
        throw new HttpException('Друг не создан',HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }
  }

  async getById(id:number)
  {
    const friend = await this.friendRepository.findByPk(id);
    if(friend)
    {
      return friend;
    }
    throw new HttpException('Друг не найден',HttpStatus.NOT_FOUND);
  }

  async getPagedByUser(userId:number, limit :number = 9,page:number = 0)
  {
    this.usersService.getUserById(userId).catch((error) =>
    {
      throw new HttpException('Друзья не найдены: пользователь не найден',HttpStatus.NOT_FOUND);
    });

    const offset = page * limit - limit;
    return this.friendRepository.findAndCountAll(
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
        throw new HttpException('Друзья не найдены',HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

}
