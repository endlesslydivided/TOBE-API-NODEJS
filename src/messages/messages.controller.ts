import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";

@Controller('messages')
export class MessagesController {

  constructor(private messagesService:MessagesService) {
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(TransactionInterceptor)
  createMessage(@Body() dto: CreateMessageDto,
             @UploadedFiles() files,
                @TransactionParam() transaction: Transaction)
  {
    return this.messagesService.create(dto,transaction,files);
  }
}
