export class CreatePostDto
{
  readonly title:string;
  readonly description:string;
  readonly content: string;
  readonly userId:number;
  readonly categoryId: number;
  readonly tags: string[]
}