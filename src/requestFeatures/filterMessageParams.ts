import RequestParameters from "./request.params";


export class FilterMessageParams extends RequestParameters
{

  constructor()
  {
    super();
    this.orderBy = 'createdAt';
    this.orderDirection = 'DESC';
    this.fields = ['id','lastName','firstName','sex','email','password','country','sex','mainPhoto','refreshToken'];
    this.lastDate = Date.now().toString();
  }

  lastDate: string = ''
  search: string = '';

}
