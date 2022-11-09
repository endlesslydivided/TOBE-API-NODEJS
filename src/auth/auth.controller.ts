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
  async login(@Body() authDto: AuthDto,@Res() response: Response) 
  {
    const body = await this.authService.login(authDto);
    const nowAccessDate = new Date(Date.now());
    const nowrefresDate = new Date(Date.now());

    nowAccessDate.setMinutes(new Date(Date.now()).getMinutes() + 60);
    nowrefresDate.setMinutes(new Date(Date.now()).getMinutes() + 10080);

    response.cookie("accessToken",body.accessToken,{maxAge: nowAccessDate.getTime() -  Date.now()});
    response.cookie("refreshToken",body.refreshToken,{maxAge: nowrefresDate.getTime() -  Date.now(),});

    response.json({user: body.user});
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) 
  {
    return this.authService.registration(createUserDto);
  }

  @Get('/logout')
  logout(@Req() req: Request,@Res() response: Response) 
  {
    response.cookie("accessToken",{expires: 0});
    response.cookie("refreshToken",{maxAge: 0});
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
  refreshTokens(@Req() req: Request) 
  {
  return this.authService.refreshTokens(req['user']);
  }
}
