import { ExecutionContext, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {

    constructor(@Inject(forwardRef(() => UsersService)) private userService: UsersService,
                @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
                @Inject(forwardRef(() => AuthService)) private authService: AuthService){
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> 
    {
        try 
        {
            const request: Request = context.switchToHttp().getRequest();
            const response: Response = context.switchToHttp().getResponse();

            const refreshToken = request.cookies.refreshToken;
            const user = await this.userService.getUserById(request['user'].id);

            if (!!refreshToken || !!user || user.refreshToken != user.refreshToken)
            {        
                await this.authService.logout(user.id);
                response.cookie("accessToken",{expires: 0});
                response.cookie("refreshToken",{maxAge: 0});
                throw new ForbiddenException("Пользователь не имеет доступа. Ошибка обновления токена.");
            }
            const refreshTokenValid = this.jwtService.verify(refreshToken,{algorithms:['RS256'] ,publicKey: process.env.REFRESH_TOKEN_PUBLIC});
        
            if (!refreshTokenValid) 
            {
                await this.authService.logout(user.id);
                response.cookie("accessToken",{expires: 0});
                response.cookie("refreshToken",{maxAge: 0});
                throw new ForbiddenException("Пользователь не имеет доступа. Токен не валидный");
            } 
            return true;
        } 
        catch (error) 
        {
            if (error instanceof HttpException) 
            {
                throw error;
            } 
            else 
            {
                throw new HttpException("Ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}