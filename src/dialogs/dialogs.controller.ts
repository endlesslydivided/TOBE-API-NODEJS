import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { DialogsService } from "./dialogs.service";
import { Dialog } from "./dialogs.model";
import { CreateDialogDto } from "./dto/createDialog.dto";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { Transaction } from "sequelize";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { UpdateDialogDto } from "./dto/updateDialog.dto";

@ApiTags('Dialogs')
@Controller('dialogs')
export class DialogsController {

  constructor(
    private dialogsService: DialogsService
  )
  {}

  @ApiOperation({summary:"Dialog creation"})
  @ApiResponse({status:200,type:Dialog})
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransactionInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createDialog(@Body() dialogDto: CreateDialogDto,@TransactionParam() transaction: Transaction)
  {
    return this.dialogsService.create(dialogDto,transaction);
  }

  @ApiOperation({summary:"Update dialog by id"})
  @ApiResponse({status:200,type:Dialog})
  @HttpCode(HttpStatus.OK)
  @Put(`/:id`)
  updateDialog(@Body() dialogDto: UpdateDialogDto,@Param('id') id:number)
  {
    return this.dialogsService.update(id,dialogDto);
  }

  @ApiOperation({summary:"Delete a dialog"})
  @ApiResponse({status:204})
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/:id')
  deleteDialog(@Param('id') id:number)
  {
    return this.dialogsService.delete(id);
  }
}
