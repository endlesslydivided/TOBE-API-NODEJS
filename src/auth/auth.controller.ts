import { Body, Controller, forwardRef, Get, HttpStatus, Inject, Param, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, response, Response } from "express";
import { User } from "src/users/users.model";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { Auth, AuthUser } from "./decorators/auth.decorator";
import { AuthDto } from "./dto/Auth.dto";
import { AccessTokenGuard } from "./guards/accessToken.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {

  constructor(@Inject(forwardRef(() => UsersService)) private userService: UsersService,
              private authService: AuthService) {
  }

  @Post("/login")
  async login(@Body() authDto: AuthDto,@Res() response: Response) 
  {
    const body = await this.authService.login(authDto);
    const nowrefresDate = new Date(Date.now());
    const nowAccessDate = new Date(Date.now());

    nowAccessDate.setMinutes(new Date(Date.now()).getMinutes() + 60);
    nowrefresDate.setMinutes(new Date(Date.now()).getMinutes() + 10080);

    response.cookie("accessToken",
    
    JSON.stringify
    (
      {token:body.accessToken, type:'Bearer'}),
      {maxAge: nowAccessDate.getTime() -  Date.now(),httpOnly:true, secure:true, sameSite:"lax"}
    );

    response.cookie("refreshToken",JSON.stringify({token: body.refreshToken}),{maxAge: nowrefresDate.getTime() -  Date.now(),httpOnly:true, secure:true, sameSite:"lax"});
    response.json(body.user);

  }

  @ApiOperation({ summary: "Get me" })
  @ApiCreatedResponse({ type: User })
  @UseGuards(AccessTokenGuard)
  @Get("/me")
  getMe(@Auth() user: AuthUser) 
  {
    return this.userService.getUserByEmail(user.email);
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) 
  {
    return this.authService.registration(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Auth() user: AuthUser,@Res() response: Response) 
  {
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
    response.json(this.authService.logout(user.id));
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
  async refreshTokens(@Auth() user: AuthUser,@Res() response: Response) 
  {
    const body = await this.authService.refreshTokens(user);
    const nowrefresDate = new Date(Date.now());
    const nowAccessDate = new Date(Date.now());

    nowAccessDate.setMinutes(new Date(Date.now()).getMinutes() + 60);
    nowrefresDate.setMinutes(new Date(Date.now()).getMinutes() + 10080);

    response.cookie("accessToken",JSON.stringify({token:body.accessToken, type:'Bearer'}),
      {maxAge: nowAccessDate.getTime() -  Date.now(),httpOnly:true, secure:true, sameSite:"lax"}
    );

    response.cookie("refreshToken",JSON.stringify({token: body.refreshToken}),{maxAge: nowrefresDate.getTime() -  Date.now(),httpOnly:true, secure:true, sameSite:"lax"});
    response.end();
  }
}
