import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const [token, bearer] = authHeader.split(" ");

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException({ message: "Пользователь не авторизован" });
      }

      request.user = this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: "Пользователь не авторизован" });
    }
  }

}