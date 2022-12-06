import { forwardRef, Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AccessTokenStrategy } from "./strategy/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategy/refreshToken.strategy";
import { MailModule } from "src/mail/mail.module";
import { AlbumsModule } from "src/albums/albums.module";

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AlbumsModule),
    {
      ...JwtModule.register({}),
      global:true
    }
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {
}
