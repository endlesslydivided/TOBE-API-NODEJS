import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tag } from "../tags/tags.model";
import { User } from "../users/users.model";
import { Photo } from "./photos.model";
import { Album } from "../albums/albums.model";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";
import { AlbumsService } from "../albums/albums.service";

@Module({
  providers: [PhotosService],
  controllers: [PhotosController],
  imports:
    [
      SequelizeModule.forFeature([User,Photo,Album,Tag]),
      AlbumsService
    ],
  exports:
    [
      PhotosService,
    ]})
export class PhotosModule {}
