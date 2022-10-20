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
import { MessagesController } from "./messages/messages.controller";
import { MessagesService } from "./messages/messages.service";
import { MessagesModule } from "./messages/messages.module";
import { AlbumsController } from "./albums/albums.controller";
import { AlbumsService } from "./albums/albums.service";
import { AlbumsModule } from "./albums/albums.module";
import { PhotosController } from "./photos/photos.controller";
import { PhotosService } from "./photos/photos.service";
import { PhotosModule } from "./photos/photos.module";
import { Dialog } from "./dialogs/dialogs.model";
import { Attachment } from "./attachments/attachments.model";
import { Message } from "./messages/messages.model";
import { UserDialog } from "./dialogs/userDialogs.model";
import { Post } from "./posts/posts.model";
import { CategoryService } from "./category/category.service";
import { CategoryModule } from "./category/category.module";
import { Category } from "./category/category.model";
import { Photo } from "./photos/photos.model";
import { Album } from "./albums/albums.model";
import { TagsModule } from "./tags/tags.module";
import { Tag } from "./tags/tags.model";

@Module(    {
  controllers: [MessagesController, AlbumsController, PhotosController],
  providers: [MessagesService, AlbumsService, PhotosService, CategoryService],
  imports:[
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({

      dialect:'postgres',
      host:process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username:process.env.POSTGRES_USER,
      password:process.env.POSTGRES_PASSWORD,
      database:process.env.POSTGRES_DB,
      models:[User,Role,UserRoles,Dialog,UserDialog,Message,Post,Attachment,Category,Album,Photo,Tag],
      autoLoadModels: true,
      synchronize:true
    }),
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
    TagsModule
  ]
}
)
export class AppModule
{

}