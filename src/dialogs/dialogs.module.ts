import { forwardRef, Module } from "@nestjs/common";
import { DialogsService } from "./dialogs.service";
import { DialogsController } from "./dialogs.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Message } from "../messages/messages.model";
import { Dialog } from "./dialogs.model";
import { UserDialog } from "./userDialogs.model";
import { User } from "../users/users.model";
import { UsersModule } from "../users/users.module";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { MessagesModule } from "../messages/messages.module";

@Module({
  providers: [DialogsService, TransactionInterceptor],
  controllers: [DialogsController],
  imports:
    [
      SequelizeModule.forFeature([Message, Dialog, UserDialog, User]),
      forwardRef(() => UsersModule),
      forwardRef(() => MessagesModule)
    ],
  exports:
    [
      DialogsService
    ]
})
export class DialogsModule {
}
