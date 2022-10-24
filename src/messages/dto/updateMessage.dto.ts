export class UpdateMessageDto
{
  readonly text:string;
  readonly attachmentsIds: number[];
  readonly newTags: string[];
  readonly oldTags: number[]

}