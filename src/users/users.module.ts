import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/userRoles.model";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { AlbumsModule } from "../albums/albums.module";
import { Album } from "../albums/albums.model";
import { Message } from "../messages/messages.model";
import { Photo } from "../photos/photos.model";
import { Dialog } from "../dialogs/dialogs.model";
import { Post } from "../posts/posts.model";
import { PhotosModule } from "../photos/photos.module";
import { DialogsModule } from "../dialogs/dialogs.module";
import { PostsModule } from "../posts/posts.module";
import { FriendsModule } from "../friends/friends.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:
    [
      SequelizeModule.forFeature([User, Role, UserRoles, Album, Message, Photo, Dialog, Post]),
      forwardRef(() => RolesModule),
      forwardRef(() => AlbumsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => PhotosModule),
      forwardRef(() => DialogsModule),
      forwardRef(() => FriendsModule),
      forwardRef(() => PostsModule)

    ],
  exports:
    [
      UsersService
    ]
})
export class UsersModule {
}
