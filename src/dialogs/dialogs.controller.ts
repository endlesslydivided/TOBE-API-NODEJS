import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { DialogsService } from "./dialogs.service";
import { Dialog } from "./dialogs.model";
import { CreateDialogDto } from "./dto/createDialog.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { Transaction } from "sequelize";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { UpdateDialogDto } from "./dto/updateDialog.dto";
import { MessagesService } from "../messages/messages.service";

@ApiTags("Dialogs")
@Controller("dialogs")
export class DialogsController {

  constructor(
    private dialogsService: DialogsService,
    @Inject(forwardRef(() => MessagesService)) private messagesService: MessagesService
  ) {
  }

  @ApiOperation({ summary: "Dialog creation" })
  @ApiOkResponse({ type: Dialog })
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  createDialog(@Body() dialogDto: CreateDialogDto, @TransactionParam() transaction: Transaction) {
    return this.dialogsService.createDialog(dialogDto, transaction);
  }

  @ApiOperation({ summary: "Update dialog by id" })
  @ApiOkResponse()
  @Put(`/:id`)
  updateDialog(@Body() dialogDto: UpdateDialogDto, @Param("id") id: number) {
    return this.dialogsService.updateDialog(id, dialogDto);
  }

  @ApiOperation({ summary: "Delete a dialog" })
  @ApiNoContentResponse()
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @Delete("/:id")
  deleteDialog(@Param("id") id: number) {
    return this.dialogsService.deleteDialog(id);
  }

  
  @ApiOperation({ summary: "Get a dialog" })
  @ApiNoContentResponse()
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @Get("/:id")
  getOneDialog(@Param("id") id: number) {
    return this.dialogsService.getDialogById(id);
  }

  // @ApiOperation({ summary: "Get paged dialog' messages" })
  // @ApiOkResponse({ type: "{rows:Message[],count:number}" })
  // @Get("/:id/messages")
  // getPagedMessageByDialog(@Param("id") dialogId: number,
  //                         @Query("limit") limit: number,
  //                         @Query("page") page: number) {
  //   return this.messagesService.getPagedMessageByDialog(dialogId, limit, page);
  // }
}
