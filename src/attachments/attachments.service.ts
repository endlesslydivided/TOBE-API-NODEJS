import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Album } from "../albums/albums.model";
import { UsersService } from "../users/users.service";
import { CreateAlbumDto } from "../albums/dto/createAlbum.dto";
import { UpdateAlbumDto } from "../albums/dto/updateAlbum.dto";
import { Attachment } from "./attachments.model";
import { MessagesService } from "../messages/messages.service";
import { PostsService } from "../posts/posts.service";
import { FilesService } from "../files/files.service";

@Injectable()
export class AttachmentsService {

  constructor(
    @InjectModel(Attachment) private attachmentRepository:typeof Attachment,
    private fileService:FilesService)
  {  }

  async createAttachments(files:any,attachableType:string,attachableId: number)
  {
    return files.map((file,order) =>
      {
        this.fileService.createFile(file).then( async (path) =>
        {
          await this.attachmentRepository.create({path,order,attachableId,attachableType})
        });
      }
    )
  }




}
