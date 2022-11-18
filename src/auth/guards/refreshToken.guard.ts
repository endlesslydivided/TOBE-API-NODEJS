import { ExecutionContext, ForbiddenException, forwardRef, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') 
{

    constructor(@Inject(forwardRef(() => JwtService)) private jwtService: JwtService)
    {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> 
    {
        try 
        {
            const request: Request = context.switchToHttp().getRequest();
            const cookie =request.header('cookie');
            if(cookie)
            {
                const refreshTokenString = cookie.split("; ")[0].split('refreshToken=')[1];
                if(refreshTokenString)
                {
                    const refreshToken = JSON.parse(decodeURIComponent(refreshTokenString));
                    if (refreshToken)
                    {        
                        const decoded = await this.jwtService.verifyAsync(refreshToken.token,{algorithms:['RS256'] ,publicKey: process.env.REFRESH_TOKEN_PUBLIC});

                        if(decoded)
                        {
                            request['principal'] = decoded;
                            return true;
                        }
                    }
                }
            }           

            throw new ForbiddenException("Пользователь не имеет доступа. Ошибка обновления токена.");       
        } 
        catch (error) 
        {
            if (error instanceof HttpException) 
            {
                throw error;
            } 
            throw new InternalServerErrorException("Ошибка на стороне сервера");
        }
    }
}