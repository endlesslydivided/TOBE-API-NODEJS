import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tag } from "../tags/tags.model";
import { User } from "../users/users.model";
import { Photo } from "./photos.model";
import { Album } from "../albums/albums.model";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";
import { AlbumsModule } from "../albums/albums.module";
import { UsersModule } from "../users/users.module";
import { FilesModule } from "../files/files.module";
import { TagsModule } from "../tags/tags.module";

@Module({
  providers: [PhotosService],
  controllers: [PhotosController],
  imports:
    [
      SequelizeModule.forFeature([User, Photo, Album, Tag]),
      forwardRef(() => AlbumsModule),
      forwardRef(() => UsersModule),
      forwardRef(() => FilesModule),
      forwardRef(() => TagsModule)

    ],
  exports:
    [
      PhotosService
    ]
})
export class PhotosModule {
}
