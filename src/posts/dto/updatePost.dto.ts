export class UpdatePostDto
{
  readonly title:string;
  readonly description:string;
  readonly content: string;
  readonly categoryId: number;
  readonly attachmentsIds: number[];
  readonly userId:number;
  readonly newTags: string[];
  readonly oldTags: number[]
}