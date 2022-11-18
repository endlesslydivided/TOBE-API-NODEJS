import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Album } from "./albums.model";

import { UsersService } from "../users/users.service";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";

@Injectable()
export class AlbumsService {

  constructor(
    @InjectModel(Album) private albumsRepository: typeof Album,
    private userService: UsersService) {
  }

  async createAlbum(dto: CreateAlbumDto) {
    const user = await this.userService.getUserById(dto.userId);
    if (user) 
    {
      return await this.albumsRepository.findOrCreate({where:{name:dto.name},defaults: dto});
    }
    throw new HttpException("Альбом не создан: пользователь не найден", HttpStatus.NOT_FOUND);
  }

  async updateAlbum(id: number, dto: UpdateAlbumDto) {
    const album = await this.albumsRepository.findByPk(id);
    if (album) {
      return await this.albumsRepository.update(dto, { where: { id } });
    }
    throw new HttpException("Альбом не найден", HttpStatus.NOT_FOUND);
  }

  async getAllByUser(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (user) {
      return await this.albumsRepository.findAll<Album>({ where: { userId } });
    }
    throw new HttpException("Альбомы не найдены: пользователь не найден", HttpStatus.NOT_FOUND);
  }

  async getPagedAlbumsByUser(userId: number, limit: number = 9, page: number = 0) {
    const user = await this.userService.getUserById(userId);
    const offset = page * limit - limit;
    if (user) {
      return await this.albumsRepository.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [["createdAt", "DESC"]]
      });
    }
    throw new HttpException("Сообщения не найдены: диалог не существует", HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const album = await this.albumsRepository.findByPk(id);
    if (album) {
      return album;
    }
    throw new HttpException("Альбом не найден", HttpStatus.NOT_FOUND);
  }

  async deleteAlbum(id: number) {
    const album = await this.albumsRepository.findByPk(id);
    if (album) {
      return await this.albumsRepository.destroy({ where: { id } });
    }
    throw new HttpException("Альбом для удаления не найден", HttpStatus.NOT_FOUND);
  }

}
