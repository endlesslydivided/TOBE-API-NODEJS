import { ExecutionContext, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') 
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
        const accessTokenString = cookie.split("; ").filter(x => x.startsWith('accessToken='))[0];
        if(accessTokenString)
        {
          const accessToken = JSON.parse(decodeURIComponent(accessTokenString.split('accessToken=')[1]));
          if(accessToken?.token && accessToken?.type === 'Bearer')         
          { 
            const decoded = await this.jwtService.verifyAsync(accessToken.token,{algorithms:['RS256'] ,publicKey: process.env.ACCESS_TOKEN_PUBLIC});
            if(decoded)
            {
              request['principal'] = decoded;
              return true;
            }   
          }
        }     
      }
     
      throw new ForbiddenException("Пользователь не имеет доступа");
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