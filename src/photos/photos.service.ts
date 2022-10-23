import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Album } from "../albums/albums.model";
import { UsersService } from "../users/users.service";
import { CreateAlbumDto } from "../albums/dto/createAlbum.dto";
import { UpdateAlbumDto } from "../albums/dto/updateAlbum.dto";
import { AlbumsService } from "../albums/albums.service";
import { Photo } from "./photos.model";

@Injectable()
export class PhotosService {

  // constructor(
  //   @InjectModel(Album) private photoRepository:typeof Photo,
  //   private albumService:AlbumsService)
  // {  }
  //
  // async createPhoto(dto: CreateAlbumDto)
  // {
  //   const user = await this.albumService.(dto.userId);
  //   if(user)
  //   {
  //     return await this.photoRepository.create(dto);
  //   }
  //   throw new HttpException('Пользователь не найден',HttpStatus.NOT_FOUND);
  // }
  //
  // async updateAlbum(id:number,dto: UpdateAlbumDto)
  // {
  //   const album = await this.albumRepository.findByPk(id);
  //   if(album)
  //   {
  //     return await this.albumRepository.update(dto,{where: {id}});
  //   }
  //   throw new HttpException('Альбом не найден',HttpStatus.NOT_FOUND);
  // }
  //
  // async getAllByUser(id:number)
  // {
  //   const album = await this.albumRepository.findByPk(id);
  //   if(album)
  //   {
  //     return album;
  //   }
  //   throw new HttpException('Пользователь не найден',HttpStatus.NOT_FOUND);
  // }
  //
  // async deleteAlbum(id:number)
  // {
  //   const album = await this.albumRepository.findByPk(id);
  //   if(album)
  //   {
  //     await this.albumRepository.destroy({where :{id}});
  //     return HttpStatus.NO_CONTENT;
  //   }
  //   throw new HttpException('Альбом не найден',HttpStatus.NOT_FOUND);
  // }
}
