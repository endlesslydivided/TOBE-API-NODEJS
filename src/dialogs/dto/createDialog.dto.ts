export class CreateDialogDto
{
  readonly name:string;
  readonly isChat:boolean;
  readonly creatorId:number;
  readonly usersId: number[]
}