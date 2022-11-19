import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/roles.model";
import { UserRoles } from "./roles/userRoles.model";
import { AuthModule } from "./auth/auth.module";
import { PostsModule } from "./posts/posts.module";
import { AttachmentsModule } from "./attachments/attachments.module";
import { DialogsModule } from "./dialogs/dialogs.module";
import { MessagesModule } from "./messages/messages.module";
import { AlbumsModule } from "./albums/albums.module";
import { PhotosModule } from "./photos/photos.module";
import { Dialog } from "./dialogs/dialogs.model";
import { Attachment } from "./attachments/attachments.model";
import { Message } from "./messages/messages.model";
import { UserDialog } from "./dialogs/userDialogs.model";
import { Post } from "./posts/posts.model";
import { CategoryModule } from "./category/category.module";
import { Category } from "./category/category.model";
import { Photo } from "./photos/photos.model";
import { Album } from "./albums/albums.model";
import { TagsModule } from "./tags/tags.module";
import { Tag } from "./tags/tags.model";
import { FilesModule } from "./files/files.module";
import { FriendsModule } from "./friends/friends.module";
import { Friend } from "./friends/friends.model";
import { MailModule } from './mail/mail.module';
import { MulterModule } from "@nestjs/platform-express";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { ServeStaticModule } from "@nestjs/serve-static";
import {join} from "path";

@Module({
    controllers: [],
    providers: [],
    imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      SequelizeModule.forRoot({
        logging: false,
        dialect: "postgres",
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [User, Role, UserRoles, Dialog, UserDialog, Message, Post, Attachment, Category, Album, Photo, Tag, Friend],
        autoLoadModels: true,
        synchronize: true,
        
      }),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '.', 'static'),
      }),
      NestjsFormDataModule,
      UsersModule,
      RolesModule,
      AuthModule,
      PostsModule,
      AttachmentsModule,
      DialogsModule,
      MessagesModule,
      AlbumsModule,
      PhotosModule,
      CategoryModule,
      TagsModule,
      FilesModule,
      FriendsModule,
      MailModule
    ]
  }
)
export class AppModule {
  
}