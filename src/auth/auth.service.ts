import { Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt"
import { User } from "../users/users.model";
@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private jwtService:JwtService) {
  }

  async login(userDto:CreateUserDto)
  {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto:CreateUserDto)
  {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if(candidate)
    {
      throw new HttpException('Пользователь с такими данными уже существует',HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();

    userDto.password = await bcrypt.hash(userDto.password, salt);
    const user = await this.userService.createUser({...userDto , salt: salt});
    return this.generateToken(user);
  }

  private async generateToken(user: User)
  {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    return{
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: CreateUserDto)
  {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordHash = await bcrypt.hash(userDto.password, user.salt);

    const passwordEquals = await bcrypt.compare(passwordHash,user.password);

    if(user && passwordEquals)
    {
      return user;
    }
    throw new UnauthorizedException({message: 'Неккоректные email или парль'});
  }
}
