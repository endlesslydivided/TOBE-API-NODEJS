import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Album } from "./albums.model";

import { UsersService } from "../users/users.service";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";

@Injectable()
export class AlbumsService {

  constructor(
    @InjectModel(Album) private albumRepository:typeof Album,
    private userService:UsersService)
  {  }

  async createAlbum(dto: CreateAlbumDto)
  {
    const user = await this.userService.getUserById(dto.userId);
    if(user)
    {
      return await this.albumRepository.create(dto);
    }
    throw new HttpException('Пользователь не найден',HttpStatus.NOT_FOUND);
  }

  async updateAlbum(id:number,dto: UpdateAlbumDto)
  {
    const album = await this.albumRepository.findByPk(id);
    if(album)
    {
      return await this.albumRepository.update(dto,{where: {id}});
    }
    throw new HttpException('Альбом не найден',HttpStatus.NOT_FOUND);
  }

  async getAllByUser(userId:number)
  {
    const user = await this.userService.getUserById(userId);
    if(user)
    {
      return await this.albumRepository.findAll<Album>({where: {userId}});
    }
    throw new HttpException('Пользователь не найден',HttpStatus.NOT_FOUND);
  }

  async getById(id:number)
  {
    const album = await this.albumRepository.findByPk(id);
    if(album)
    {
      return album;
    }
    throw new HttpException('Альбом не найден',HttpStatus.NOT_FOUND);
  }

  async deleteAlbum(id:number)
  {
    const album = await this.albumRepository.findByPk(id);
    if(album)
    {
      await this.albumRepository.destroy({where :{id}});
      return HttpStatus.NO_CONTENT;
    }
    throw new HttpException('Альбом не найден',HttpStatus.NOT_FOUND);
  }

}
