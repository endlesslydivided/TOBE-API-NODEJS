import {SubscribeMessage,WebSocketGateway,OnGatewayInit,WebSocketServer,OnGatewayConnection,OnGatewayDisconnect, MessageBody,} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/createMessage.dto';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { forwardRef, HttpException,UseGuards, HttpStatus,UseInterceptors, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { MessagesService } from 'src/messages/messages.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from 'src/decorators/transactionParam.decorator';
import { Transaction } from 'sequelize';
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { Auth, AuthUser } from 'src/auth/decorators/auth.decorator';
import { UsersService } from 'src/users/users.service';

enum ChatClientEvent 
{
    ReceiveMessage = 'receive_message',
    ReceiveDialogs = 'receive_dialogs',
    DialogMessages = 'dialog_messages',
}

enum ChatServerEvent 
{
    SendMessage = 'send_message',
    GetDialogMessages = 'get_dialog_messages',
    GetDialogs = 'get_dialogs',
}

@WebSocketGateway(5001,{cors: {
  origin:  true,
  credentials: true,
  preflightContinue: false
},path:"/chat"})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
  constructor( @Inject(forwardRef(() => MessagesService)) private messagesService: MessagesService,
  @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  @Inject(forwardRef(() => DialogsService)) private dialogsService: DialogsService)
  {

  }

  @WebSocketServer() 
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  
  @SubscribeMessage(ChatServerEvent.SendMessage)
  @UseInterceptors(TransactionInterceptor)
  handleSendMessage(@MessageBody() body,  @TransactionParam() transaction: Transaction) 
  {
    return this.messagesService.createMessage(body.dto,transaction).then(async (message) =>
    {
      const userData = await this.userService.getUserById(message.userId);
      this.server.to(body.fromUserId.toString()).emit(ChatClientEvent.ReceiveMessage, 
        {message,user:userData,dialogId:body.dto.dialogId});
      this.server.to(body.toUserId.toString()).emit(ChatClientEvent.ReceiveMessage, 
        {message,user:userData,dialogId:body.dto.dialogId});

    });
    
  }

  @SubscribeMessage(ChatServerEvent.GetDialogMessages)
  @UseInterceptors(TransactionInterceptor)
  async handleGetDialogMessages(@MessageBody() body: any) 
  {
    const messages = this.messagesService.getPagedMessagesByDialog(body.dialogId,body.filters);
    messages.then((messages) =>
    {
      this.server.to(body.auth.id.toString()).emit(ChatClientEvent.ReceiveMessage, {messages,dialogId:body.dialogId});
    })
  }

  @SubscribeMessage(ChatServerEvent.GetDialogs)
  @UseInterceptors(TransactionInterceptor)
  async handleGetDialogs(@MessageBody() body: any) 
  {
    const dialogs = this.dialogsService.getPagedDialogsByUser(body.userId,body.filters);
    dialogs.then((dialogs) =>
    {
      this.server.to(body.auth.id.toString()).emit(ChatClientEvent.ReceiveDialogs, dialogs);
    })
  }

  afterInit(server: Server) 
  {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) 
  {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards (AccessTokenGuard)
  handleConnection(client: Socket,  @Auth() user: AuthUser,...args: any[]) 
  {
    const auth = client.handshake.auth;
    
    if(auth.dialogId && auth.id)    client.join(auth.dialogId.toString() + auth.id.toString());
    if(auth.dialogId)      client.join(auth.dialogId.toString())
    if(auth.id)      client.join(auth.id.toString())

    this.logger.log(`Client connected: ${client.id}`);
  }
}