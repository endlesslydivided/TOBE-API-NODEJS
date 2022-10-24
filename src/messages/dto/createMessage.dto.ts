import { Tag } from "../../tags/tags.model";

export class CreateMessageDto
{
  readonly text:string;
  readonly dialogId:number
  readonly userId:number
  readonly tags: string[]
}