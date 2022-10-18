import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/createUser.dto";
import { genSalt, hash } from "bcrypt";

@Injectable()
export class UsersService
{
  constructor(
    @InjectModel(User) private userRepository:typeof User) {
  }
  async createUser(dto: CreateUserDto)
  {
    const salt = await genSalt();
    dto.passwordHash = await hash(dto.passwordHash, salt);
    return await this.userRepository.create({ salt: salt, ...dto });
  }

  async getAllUser()
  {
    return await this.userRepository.findAll();
  }
}
