import { ExecutionContext, forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Observable, throwError, throwIfEmpty } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(@Inject(forwardRef(() => JwtService)) private jwtService: JwtService) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try 
        {
          const request: Request = context.switchToHttp().getRequest();

          const authHeader = request.header('Authorization').split(' ');
          const result = this.jwtService.verify(authHeader[1],{algorithms:['RS256'] ,publicKey: process.env.ACCESS_TOKEN_PUBLIC});
          if(authHeader[0] === 'Bearer' && result)
          {
            return true;
          }

          throw new HttpException("Пользователь не имеет доступа", HttpStatus.FORBIDDEN);
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