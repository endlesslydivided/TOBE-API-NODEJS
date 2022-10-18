import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/createUser.dto";
import { genSalt, hash } from "bcrypt";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService
{
  constructor(
    @InjectModel(User) private userRepository:typeof User,
  private roleService:RolesService)
  {  }

  async createUser(dto: CreateUserDto)
  {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByName("USER");
    await user.$set('roles',[role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUser()
  {
    return await this.userRepository.findAll({
      include:
        {
          all:true
        }
    });
  }

  async getUserByEmail(email:string)
  {
    return await this.userRepository.findOne({where:{email},include:{all:true}})
  }
}
