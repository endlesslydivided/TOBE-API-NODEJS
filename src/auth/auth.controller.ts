import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, response, Response } from "express";
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
  login(@Body() authDto: AuthDto,@Res() res: Response) {
    res.cookie("logged_in",true,{maxAge: 3600,});
    res.status(200).json(this.authService.login(authDto));
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: Request,@Res() res: Response) {
    res.cookie("logged_in",true,{maxAge: 0});

    return this.authService.logout(req['user']['id']);
  }

  @Get('/confirm')
  confirmEmail(@Query('token') token:string,@Res() res: Response) 
  {
    if(!this.authService.confirmEmail(token))
    {
      res.location(process.env.REACT_SERVER_ADRESS).sendStatus(HttpStatus.TEMPORARY_REDIRECT);
    }
    res.location(`${process.env.REACT_SERVER_ADRESS}/login/success`).sendStatus(HttpStatus.TEMPORARY_REDIRECT);

  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@Req() req: Request) {
  const userId = req['user']['id'];
  const refreshToken = req['user']['refreshToken'];
  return this.authService.refreshTokens(userId, refreshToken);
}
}
