import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { DialogsModule } from 'src/dialogs/dialogs.module';
import { MessagesModule } from "src/messages/messages.module";
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  controllers: [],
  imports:
    [
      forwardRef(() => UsersModule),
      forwardRef(() => AuthModule),
      forwardRef(() => MessagesModule),
      forwardRef(() => DialogsModule)
    ],
  providers: [ChatService,ChatGateway],
})
export class ChatModule {}
