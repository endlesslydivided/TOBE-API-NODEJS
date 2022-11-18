import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/createUser.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/addRole.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { Album } from "src/albums/albums.model";
import { Role } from "src/roles/roles.model";

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
      }
    ]
  });
  }

  async getUserById(id: number) {
    return await this.userRepository.findByPk(id, {include: [
      Album, 
      {
        model: Role,
        attributes: ['name']  
      }
    ],
    attributes:['id','firstName','lastName','email','emailConfirmed','phoneNumber','mainPhoto','refreshToken']
  });
  }

  async getPagedUsers(limit: number = 9, page: number = 0) {
    const offset = page * limit - limit;
    return await this.userRepository.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] });
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
    return await (await this.userRepository.findByPk(id)).update(dto);
  }

  async updateRefreshTokenById(id, refreshToken) 
  {
    return await (await this.userRepository.findByPk(id)).update({refreshToken});
  }
}
