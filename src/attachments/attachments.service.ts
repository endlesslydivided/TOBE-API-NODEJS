import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Attachment } from "./attachments.model";
import { PostsService } from "../posts/posts.service";
import { FilesService } from "../files/files.service";
import { Transaction } from "sequelize";
import { throwError } from "rxjs";
import { DialogsService } from "../dialogs/dialogs.service";
import { Message } from "../messages/messages.model";

enum AttachmentScopes
{
  MESSAGE = "message",
  POST = "post"
}

@Injectable()
export class AttachmentsService {

  constructor(
    @InjectModel(Attachment) private attachmentRepository:typeof Attachment,
    private fileService:FilesService,
    private dialogsService: DialogsService,
    private postsService: PostsService)
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

  async getPagedByAttachable(attachableId:number,attachableType:string, limit :number = 9,page:number = 0) : Promise<any>
  {
    switch (attachableType)
    {
      case 'message':
      {
        const dialog = await this.dialogsService.getById(attachableId);
        const offset = page * limit - limit;
        if(dialog)
        {
          return this.attachmentRepository.findAndCountAll(
            {
              include:{model : Message, where :{dialogId : attachableId}},
              limit,offset,
              where:
                {
                  attachableType
                },
              order:[['createdAt','DESC']]
            });
        }
        throw new HttpException('Прикрепления не найдены: диалог не существует',HttpStatus.NOT_FOUND);
      }
      default:
      {
        throw new HttpException('Прикрепления не найдены.',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getAllByAttachable(attachableId:number,attachableType:string): Promise<any>
  {
    switch (attachableType)
    {
      case AttachmentScopes.MESSAGE:
      {
        const dialog = await this.dialogsService.getById(attachableId);
        if(dialog)
        {
          return this.attachmentRepository.findAll(
            {
              include:{model : Message, where :{messageId : attachableId}},
              where:
                {
                  attachableType
                },
              order:[['createdAt','DESC']]
            });
        }
        throw new HttpException('Прикрепления не найдены: диалог не существует',HttpStatus.NOT_FOUND);
      }
      case AttachmentScopes.POST:
      {
        const post = await this.postsService.getById(attachableId);
        if(post)
        {
          return this.attachmentRepository.findAll(
            {
              where:
                {
                  attachableId,
                  attachableType
                },
              order:[['createdAt','DESC']]
            });
        }
        throw new HttpException('Пост не найден: пост не существует',HttpStatus.NOT_FOUND);
      }
      default:
      {
        throw new HttpException('Прикрепления не найдены.',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
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
