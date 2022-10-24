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
import { Transaction } from "sequelize";
import { throwError } from "rxjs";

@Injectable()
export class AttachmentsService {

  constructor(
    @InjectModel(Attachment) private attachmentRepository:typeof Attachment,
    private fileService:FilesService)
  {  }

  async createAttachments(files:any,attachableType:string,attachableId: number,transaction: Transaction) : Promise<any[]>
  {
    return await files.map((file,order) =>
      {
        this.fileService.createFile(file).then( async (path) =>
        {
          await this.attachmentRepository.create({path,order,attachableId,attachableType},{transaction})
        }).catch((e) =>
        {
          throw throwError(e);
        });
      }
    )
  }

  async updateAttachments(attachmentsIds:number[],files:any,attachableType:string,attachableId: number,transaction: Transaction) : Promise<any[]>
  {
    const attachments = await this.attachmentRepository.findAll({where:{attachableId, attachableType},order:[['order','ASC']]});

    attachments.map((value) =>
    {
      value.order = attachmentsIds.findIndex(x => x === value.id);
      this.attachmentRepository.update(value,{where:{id: value.id},transaction}).catch((e) =>
      {
        throw throwError(e);
      });
    })
    const existingAttachmentsIds = new Set(attachments.map(a => a.id));

    const idsValuesToDelete = attachmentsIds.filter((x) => !existingAttachmentsIds.has(x));

    idsValuesToDelete.map((id) =>
    {
      this.attachmentRepository.destroy({where:{id},transaction}).catch((e) =>
      {
        throw throwError(e);
      });
    })

    const newFilesArrayIndexes = this.getAllIndexes(attachmentsIds,null);

    return await files.map((file,order) =>
      {
        this.fileService.createFile(file).then( async (path) =>
        {
          await this.attachmentRepository.create({path,order: newFilesArrayIndexes[order],attachableId,attachableType},{transaction})
        }).catch((e) =>
        {
          throw throwError(e);
        });
      }
    )
  }

  private getAllIndexes(arr:Array<any>, val:any) : Array<number>
  {
    let indexes:Array<number>, i:number;
    for(i = 0; i < arr.length; i++)
    {
      if (arr[i] === val)
      {
        indexes.push(i);
      }
    }
    return indexes;
  }

}
