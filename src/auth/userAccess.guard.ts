import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roleAuth.decorator";

@Injectable()
export class UserAccessGuard implements CanActivate
{
  constructor(private jwtService:JwtService,
              private reflector: Reflector) {
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
  {
    try
    {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      console.log(request.queryParams);
      const userId = request.userId;
      return  true;
    }
    catch (e)
    {
      throw new HttpException('Пользователь не имеет доступа',HttpStatus.FORBIDDEN);
    }
  }

}