import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from 'src/messages/messages.model';
import { MessagesModule } from 'src/messages/messages.module';
import { Photo } from 'src/photos/photos.model';
import { PhotosModule } from 'src/photos/photos.module';
import { Post } from 'src/posts/posts.model';
import { PostsModule } from 'src/posts/posts.module';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports:
  [
    SequelizeModule.forFeature([User, Post, Message, Photo]),
    forwardRef(() => PhotosModule),
    forwardRef(() => MessagesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PostsModule)
  ]
})
export class StatsModule {}
