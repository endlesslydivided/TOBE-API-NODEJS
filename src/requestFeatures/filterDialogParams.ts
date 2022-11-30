import RequestParameters from "./request.params";


export class FilterDialogParams extends RequestParameters
{

  constructor()
  {
    super();
    this.orderBy = 'createdAt';
    this.orderDirection = 'DESC';
    this.fields = ['id','lastName','firstName','sex','email','password','country','sex','mainPhoto','refreshToken'];
  }

  haveAttach: string = 'false';

  search: string = '';

}
