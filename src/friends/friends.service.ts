import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize, Transaction } from "sequelize";
import { Friend } from "./friends.model";
import { CreateFriendDto } from "./dto/createFriend.dto";
import { UpdateFriendDto } from "./dto/updateFriend.dto";
import { User } from "src/users/users.model";
import { Op } from "sequelize";
import { Photo } from "src/photos/photos.model";
import sequelize from "sequelize";
import { FilterUserParams } from "src/requestFeatures/filterUser.params";

@Injectable()
export class FriendsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(Friend) private friendRepository: typeof Friend) {
  }

  async createFriend(dto: CreateFriendDto, transaction: Transaction) 
  {
    const user = await this.usersService.getUserById(dto.userId).catch(() => {
      throw new NotFoundException("Друг не добавлен. Ошибка на стороне сервера.");
    });

    if(!user) throw new NotFoundException("Друг не добавлен: пользователь не найден");
    const anotherFriend = await this.friendRepository.findOne({where: { userId:dto.friendId, friendId:dto.userId }});
    let friend;
    if(anotherFriend)
    {
      friend = await this.friendRepository.create({...dto,isRejected:false}, { transaction });
      anotherFriend.set({isRejected:false});
      await anotherFriend.save({fields:['isRejected'],transaction})
      .catch(() => 
      {
        throw new InternalServerErrorException("Друг не удалён. Обновление записи не удалось");
      })
    }
    else
    {
      friend = await this.friendRepository.create(dto, { transaction });
    }
    
    if (!friend) throw new InternalServerErrorException("Друг не добавлен. Ошибка на стороне сервера.");
    
    return friend;
  }

  async updateFriend(id: number, dto: UpdateFriendDto, transaction: Transaction) 
  {
    const friend = await this.getFriendById(id);

    const userId = friend.friendId;
    const friendId = friend.userId;

    const updatedRow = await this.friendRepository.update(dto, { where: { id },transaction}).catch((error) => 
    {
      throw new InternalServerErrorException("Друг не обновлен");
    });

    if(dto.isRejected === false)
    {
      return this.friendRepository.create({userId,friendId,isRejected:false}, { transaction }).catch((error) => 
      {
        throw new InternalServerErrorException("Друг не создан");
      });
    }
  }

  async deleteFriend(id:number, transaction: Transaction) 
  {
    const friend = await this.friendRepository.findByPk(id);

    const affected = await this.friendRepository.destroy({where:{id:friend.id}, transaction }).catch(() => {
      throw new InternalServerErrorException("Друг не удалён");
    });
    
    const anotherFriend = await this.friendRepository.findOne({where: { userId:friend.friendId, friendId:friend.userId }});

    if(anotherFriend)
    {
      anotherFriend.set({isRejected: null});
      await anotherFriend.save({fields:['isRejected'],transaction,omitNull:false})
      .catch(() => 
      {
        throw new InternalServerErrorException("Друг не удалён. Обновление записи не удалось");
      })
    }
   
    return affected;
  }

  async getFriendById(id: number) 
  {
    const friend = await this.friendRepository.findByPk(id,{include:
    {
      model: User,
      attributes: ['id','firstName','lastName','email','city','country','sex','emailConfirmed','phoneNumber','mainPhoto']
    }});
    if (friend) 
    {
      return friend;
    }
    throw new NotFoundException("Друг не найден");
  }

  async getPagedFriendsByUser(userId: number,filters:FilterUserParams) 
  {
    const user = await this.usersService.getUserById(userId).catch((error) => 
    {
      throw new NotFoundException("Друзья не найдены: пользователь не найден");
    });

    if(!user) throw new NotFoundException("Друзья не найдены: пользователь не найден");

    return this.friendRepository.findAndCountAll(
      {
        limit: filters.limit, 
        offset: filters.offset,
        where:
        {
          userId: 
          {
              [Op.in]: Sequelize.literal(`(
              SELECT "Friend"."userId"
              FROM "friends" AS "Friend"
              WHERE
              "Friend"."friendId" = ${userId}
                  AND
              "Friend"."isRejected" is false
          )`)
          }
          
        },
        include:
        [{
          model: User,
          attributes: ['id','firstName','lastName','email','city','country','sex','emailConfirmed','phoneNumber','mainPhoto'],
          include:
          [
            {model:Photo}
          ]
        }],
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException("Друзья не найдены");
      });
  }

  async getPagedRequestsByUser(userId: number,filters:FilterUserParams) 
  {
    this.usersService.getUserById(userId).catch(() => 
    {
      throw new NotFoundException("Друзья не найдены: пользователь не найден");
    });

    return this.friendRepository.findAndCountAll(
      {
        limit: filters.limit, 
        offset: filters.offset,
        where:
          {
            userId: 
          {
              [Op.in]: Sequelize.literal(`(
              SELECT "Friend"."userId"
              FROM "friends" AS "Friend"
              WHERE
              "Friend"."friendId" = ${userId}
                  AND
              "Friend"."isRejected" is null
          )`)
          }
          },
        include:
        [{
          model: User,
          attributes: ['id','firstName','lastName','email','city','country','sex','emailConfirmed','phoneNumber','mainPhoto'],
          include:
          [
            {model:Photo}
          ]
        }],
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
        throw new InternalServerErrorException("Заявки не найдены");
      });
  }

  async getPagedAvoidedRequestsByUser(userId: number,filters:FilterUserParams) 
  {
    this.usersService.getUserById(userId).catch(() => 
    {
      throw new NotFoundException("Друзья не найдены: пользователь не найден");
    });

    return this.friendRepository.findAndCountAll(
      {
        limit: filters.limit, 
        offset: filters.offset,
        where:
          {
            userId: 
          {
              [Op.in]: Sequelize.literal(`(
              SELECT "Friend"."userId"
              FROM "friends" AS "Friend"
              WHERE
              "Friend"."friendId" = ${userId}
                  AND
              "Friend"."isRejected" = true
          )`)
          }
          },
        include:
        [{
          model: User,
          attributes: ['id','firstName','lastName','email','city','country','sex','emailConfirmed','phoneNumber','mainPhoto'],
          include:
          [
            {model:Photo}
          ]
        }],
        order: [["createdAt", "DESC"]]
      })
      .catch((error) => {
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
        order: [["createdAt", "DESC"]],
        include:[
        {
          model: User,
          attributes: ['id','firstName','lastName','email','city','country','sex','emailConfirmed','phoneNumber','mainPhoto'],
          include:
          [
            {model:Photo}
          ]
        }]
      })
      .catch((error) => {
        throw new InternalServerErrorException("Друзья не найдены");
      });
  }

}
