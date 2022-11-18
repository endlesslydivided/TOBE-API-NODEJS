import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().principal;
});

export interface AuthUser 
{
    id: number;
    email: string;
}