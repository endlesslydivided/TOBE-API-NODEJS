import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/createUser.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/addRole.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { Album } from "src/albums/albums.model";
import { Role } from "src/roles/roles.model";
import { Photo } from "src/photos/photos.model";
import { Sequelize } from "sequelize";
import { Friend } from "src/friends/friends.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService) {
  }

  async createUser(dto: CreateUserDto) 
  {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByName("USER");
    await user.$set("roles", [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() 
  {
    return await this.userRepository.findAll({
      include:
        {
          all: true
        }
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }, include: [
      Album, 
      {
        model: Role,
        attributes: ['name']  
      },
      {model:Photo}
    ]
  });
  }

  async getUserById(id: number) {
    return await this.userRepository.findByPk(id, {include: [
      Album, 
      {
        model: Role,
        attributes: ['name']  
      },
      Photo,
      Friend
    ],
    attributes:['id','firstName','lastName','email','city','country','sex',
                'emailConfirmed','phoneNumber','mainPhoto','refreshToken']
  });
  }

  async getPagedUsers(limit: number = 10, page: number = 1) 
  {
    const offset = page * limit - limit;
    return await this.userRepository.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]], include:
    [
      Photo,
    ] });
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByName(dto.value);
    if (role && user) {
      await user.$add("role", role.id);
      return dto;
    }
    throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND);
  }

  async updateUserById(id, dto: UpdateUserDto) 
  {
    const user = await this.userRepository.findByPk(id);

    return user.update(dto);
  }

  async updateRefreshTokenById(id, refreshToken) 
  {
    const user = await this.userRepository.findByPk(id);

    return await user.update({refreshToken});
  }
}
