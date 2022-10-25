import { Body, Controller, Delete, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { UpdateMessageDto } from "./dto/updateMessage.dto";

@Controller('messages')
export class MessagesController {

  constructor(private messagesService:MessagesService) {
  }


  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(TransactionInterceptor)
  @Post()
  createMessage(@Body() dto: CreateMessageDto,@UploadedFiles() files,@TransactionParam() transaction: Transaction)
  {
    return this.messagesService.create(dto, transaction, files);
  }


  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(TransactionInterceptor)
  @Put("/:id")
  updateMessage(@Param('id') messageId:number, @Body() dto: UpdateMessageDto,@UploadedFiles() files,@TransactionParam() transaction: Transaction)
  {
      return this.messagesService.update(messageId,dto,transaction,files);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(TransactionInterceptor)
  @Delete("/:id")
  deleteMessage(@Param('id') messageId:number)
  {
    return this.messagesService.delete(messageId);
  }


}
