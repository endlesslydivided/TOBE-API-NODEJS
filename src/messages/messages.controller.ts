import { Body, Controller, Delete, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { UpdateMessageDto } from "./dto/updateMessage.dto";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Message } from "./messages.model";

@ApiTags("Messages")
@Controller("messages")
export class MessagesController {

  constructor(private messagesService: MessagesService) {
  }


  @ApiOperation({ summary: "Message creation" })
  @ApiCreatedResponse({ type: Message })
  @UseInterceptors(FilesInterceptor("files"))
  @UseInterceptors(TransactionInterceptor)
  @Post()
  createMessage(@Body() dto: CreateMessageDto, @UploadedFiles() files, @TransactionParam() transaction: Transaction) {
    return this.messagesService.createMessage(dto, transaction, files);
  }

  @ApiOperation({ summary: "Message update" })
  @ApiOkResponse()
  @UseInterceptors(FilesInterceptor("files"))
  @UseInterceptors(TransactionInterceptor)
  @Put("/:id")
  updateMessage(@Param("id") messageId: number, @Body() dto: UpdateMessageDto, @UploadedFiles() files, @TransactionParam() transaction: Transaction) {
    return this.messagesService.updateMessage(messageId, dto, transaction, files);
  }

  @ApiOperation({ summary: "Message delete" })
  @ApiNoContentResponse()
  @Delete("/:id")
  deleteMessage(@Param("id") messageId: number) {
    return this.messagesService.deleteMessage(messageId);
  }


}
