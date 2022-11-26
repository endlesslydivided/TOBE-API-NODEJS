import { BadRequestException, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/users.model";
import { AuthDto } from "./dto/Auth.dto";
import * as bcrypt from 'bcrypt';
import { MailService } from "src/mail/mail.service";
import { AlbumsService } from "src/albums/albums.service";
import { CreateAlbumDto } from "src/albums/dto/createAlbum.dto";

@Injectable()
export class AuthService {

  constructor(@Inject(forwardRef(() => UsersService)) private userService: UsersService,
              @Inject(forwardRef(() => AlbumsService)) private albumsService: AlbumsService,
              @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
              private mailService: MailService) {
  }

  async login(authDto: AuthDto) 
  {
    const user = await this.validateUser(authDto);
    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user, tokens.refreshToken);
    return {user,...tokens};
  }

  async logout(userId: number) 
  {
    return this.userService.updateRefreshTokenById(userId,null);
  }

  async confirmEmail(emailToken: string) 
  {
    const mailData = await this.jwtService.verifyAsync(emailToken,{algorithms:['RS256'] ,publicKey: process.env.EMAIL_PUBLIC});
    if(mailData)
    {
      const user = await this.userService.getUserByEmail(mailData.email);
      if(user.emailConfirmed)
      {
        return false;
      }
      if(user)
      {
        user.update({emailConfirmed:true});
        return true;
      }
    }
   
    throw new HttpException("Почта не подтвреждена!", HttpStatus.BAD_REQUEST);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) 
    {
      throw new HttpException("Пользователь с такими данными уже существует", HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();

    userDto.password = await bcrypt.hash(userDto.password, salt);
    const user = await this.userService.createUser({ ...userDto, salt: salt });

    const tokens = await this.getTokens(user);
    const emailToken = await this.jwtService.signAsync({email: user.email},{algorithm:'RS256', privateKey: process.env.EMAIL_PRIVATE});
    await this.updateRefreshToken(user, tokens.refreshToken);
    await this.mailService.sendUserConfirmation(user,emailToken);

    const dto = new CreateAlbumDto();
    dto.name = 'Фото профиля';
    dto.userId = user.id;
    const album = await this.albumsService.createAlbum(dto);
    
    return tokens;
  }

  async refreshTokens(user) 
  {
    const userFromDb = await this.userService.getUserByEmail(user.email);

    if (!userFromDb) 
    {
      throw new BadRequestException("Пользователь с такими данными не существует");
    }

    const tokens = await this.getTokens(userFromDb);

    await this.updateRefreshToken(userFromDb, tokens.refreshToken);
    return tokens;
  }

  
  async updateRefreshToken(user, refreshToken: string) 
  {
    const hashedRefreshToken = await bcrypt.hash(refreshToken,user.salt);
    await this.userService.updateRefreshTokenById(user.id,hashedRefreshToken);
  }

  async getTokens(user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          algorithm:'RS256',
          privateKey:process.env.ACCESS_TOKEN_PRIVATE,
          expiresIn: '60m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          algorithm:'RS256',
          expiresIn: '7d',
          privateKey: process.env.REFRESH_TOKEN_PRIVATE
        },
      ),
    ]);
    return {accessToken,refreshToken};
  }

  

  private async validateUser(authDto: AuthDto) {
    const user = await this.userService.getUserByEmail(authDto.email);
    if(user)
    {
      const passwordHash = await bcrypt.hash(authDto.password, user.salt);

      const passwordEquals = (user.password === passwordHash);
  
      if (passwordEquals) 
      {
        return user;
      }
    }
 
    throw new UnauthorizedException({ message: "Неккоректные email или пароль" });
  }
}
