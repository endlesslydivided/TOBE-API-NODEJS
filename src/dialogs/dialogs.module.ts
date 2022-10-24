import { Module } from "@nestjs/common";
import { DialogsService } from "./dialogs.service";
import { DialogsController } from "./dialogs.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Message } from "../messages/messages.model";
import { Dialog } from "./dialogs.model";
import { UserDialog } from "./userDialogs.model";
import { User } from "../users/users.model";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { Sequelize } from "sequelize";

@Module({
  providers: [DialogsService, TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },],
  controllers: [DialogsController],
  imports:
    [
      SequelizeModule.forFeature([Message,Dialog,UserDialog,User]),

    ],
  exports:
    [
      DialogsService,
    ]
})
export class DialogsModule {}
