import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { throwError } from "rxjs";
import { Tag } from "./tags.model";

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag) private tagsRepository:typeof Tag)
  {  }

  async createTags(taggableType:string,taggableId: number,tags:string[],transaction:Transaction)
  {
    return tags.map( async (name) =>
      {
          return await this.tagsRepository.create({ name,taggableType,taggableId },{transaction});
      }
    )
  }

  async updateTags(tagsIds:number[],newTags:string[],taggableType:string,taggableId: number,transaction: Transaction) : Promise<any[]>
  {
    const tags = await this.tagsRepository.findAll({where:{taggableId, taggableType},order:[['createdAt','ASC']]});

    const existingTagsIds = new Set(tags.map(a => a.id));

    const idsValuesToDelete = tagsIds.filter((x) => !existingTagsIds.has(x));

    idsValuesToDelete.map((id) =>
    {
      this.tagsRepository.destroy({where:{id},transaction}).catch((e) =>
      {
        throw throwError(e);
      });
    })


    return this.createTags(taggableType,taggableId,newTags,transaction);
  }
}
