import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/Auth.dto";
import { AccessTokenGuard } from "./guards/accessToken.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post("/login")
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: Request) {
    this.authService.logout(req['user']['id']);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/confirm')
  confirmEmail(@Param('token') token:string) 
  {
    this.authService.confirmEmail(token);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@Req() req: Request) {
  const userId = req['user']['id'];
  const refreshToken = req['user']['refreshToken'];
  return this.authService.refreshTokens(userId, refreshToken);
}
}
