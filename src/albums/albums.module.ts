import { forwardRef, Module } from "@nestjs/common";

import { AlbumsService } from "./albums.service";
import { AlbumsController } from "./albums.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Photo } from "../photos/photos.model";
import { Album } from "./albums.model";
import { UsersModule } from "../users/users.module";
import { PhotosModule } from "../photos/photos.module";

@Module({
  providers: [AlbumsService],
  controllers: [AlbumsController],
  imports:
    [
      SequelizeModule.forFeature([Album, User, Photo]),
      forwardRef(() => UsersModule),
      forwardRef(() => PhotosModule)

    ],
  exports:
    [
      AlbumsService
    ]
})
export class AlbumsModule {
}
