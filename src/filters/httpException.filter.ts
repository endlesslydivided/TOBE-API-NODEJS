//@ts-nocheck
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message;
    if(Object.hasOwnProperty('messages')&& Array.isArray(exception?.messages))
    {
        message = exception?.messages[0].message;
    }
     message  = exception.message;

    response
      .status(status)
      .json({
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}