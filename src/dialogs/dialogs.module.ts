import { Module } from "@nestjs/common";
import { DialogsService } from "./dialogs.service";
import { DialogsController } from "./dialogs.controller";

@Module({
  providers: [DialogsService],
  controllers: [DialogsController]
})
export class DialogsModule {}
