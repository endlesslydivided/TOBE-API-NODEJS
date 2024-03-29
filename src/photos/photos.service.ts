import { forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Photo } from "./photos.model";
import { AlbumsService } from "../albums/albums.service";
import { UsersService } from "../users/users.service";
import { NotFoundError, throwError } from "rxjs";
import { FilesService } from "../files/files.service";
import { Transaction } from "sequelize";
import { CreatePhotoDto } from "./dto/createPhoto.dto";
import { TagsService } from "../tags/tags.service";
import { UpdatePhotoDto } from "./dto/updatePhoto.dto";

@Injectable()
export class PhotosService {

  private readonly ANYABLE_TYPE = "photo";

  constructor(
    @InjectModel(Photo) private photosRepository: typeof Photo,
    @Inject(forwardRef(() => AlbumsService)) private albumsService: AlbumsService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => FilesService)) private filesService: FilesService,
    @Inject(forwardRef(() => TagsService)) private tagsService: TagsService
  ) {
  }


  async createPhoto(dto: CreatePhotoDto, transaction: Transaction) 
  {
    const album = await this.albumsService.getById(dto.albumId).catch(() => {
      throw new NotFoundException("Фото не добавлено: альбом не найден");
    });

    const photo = await this.filesService.createFile(dto.file).then(async (path) => 
    {
      const {file,...photoDto} = dto;
      return await this.photosRepository.create({path,...photoDto}, {returning:true, transaction });
    });

    if (photo) 
    {
      const newTags = await this.tagsService.createTags(this.ANYABLE_TYPE, photo.id, dto?.tags, transaction).catch(() => {
        throw new InternalServerErrorException("Фото не добавлено: ошибка добавления тегов");
      });

      return photo;
    }

    throw new InternalServerErrorException("Фото не добавлено. Ошибка не стороне сервера");
  }


  async updatePhoto(id: number, dto: UpdatePhotoDto, transaction: Transaction) {
    this.photosRepository.findByPk(id).catch((error) => {
      throw new HttpException("Фото не найдено", HttpStatus.NOT_FOUND);
    });

    const { oldTags, newTags } = dto;

    return await this.photosRepository.update(dto, { where: { id }, transaction }).then(async (result) => {
      const tagsResult = await this.tagsService.updateTags(oldTags, newTags, this.ANYABLE_TYPE, id, transaction).catch((error) => {
        throw new HttpException("Фото не изменено: ошибка изменения тегов. Ошибка на стороне сервера.", HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }).catch((error) => {
      throw new HttpException("Фото не обновлено", HttpStatus.INTERNAL_SERVER_ERROR);
    });

  }

  async getAllPhotoByAlbum(albumId: number) {
    const album = await this.albumsService.getById(albumId);
    if (album) {
      return await this.photosRepository.findAll({ where: { albumId }, order: [["createdAt", "DESC"]] });
    }
    throw new HttpException("Фото не найдены: альбом не существует", HttpStatus.NOT_FOUND);
  }

  async getPagedPhotoByAlbum(albumId: number, limit: number = 9, page: number = 0) {
    const album = await this.albumsService.getById(albumId);
    const offset = page * limit - limit;
    if (album) {
      return await this.photosRepository.findAndCountAll({
        where: { albumId },
        limit,
        offset,
        order: [["createdAt", "DESC"]]
      });
    }
    throw new HttpException("Фото не найдены: альбом не существует", HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    return await this.photosRepository.findByPk(id);
  }

  async deletePhoto(id: number) {
    const photo = await this.photosRepository.findByPk(id);
    if (photo) {
      return await this.photosRepository.destroy({ where: { id } });
    }
    throw new HttpException("Фото не найдено", HttpStatus.NOT_FOUND);
  }
}
