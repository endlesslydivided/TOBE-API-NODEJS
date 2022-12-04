import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roleAuth.decorator";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,) {
  }

  async canActivate(context: ExecutionContext):Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if (!requiredRoles)
      {
        return true;
      }
      const request = context.switchToHttp().getRequest();

      const user = await this.usersService.getUserByEmail(request.principal.email);
      if(user)
      {
        const rolesNames = user.roles.map((x) => x.name);
        request.principal = user;
        return requiredRoles.some(role => rolesNames.includes(role));
      }
    } 
    catch (e) 
    {
      throw new ForbiddenException("Пользователь не имеет доступа.");
    }
  }

}