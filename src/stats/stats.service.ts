import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from 'src/messages/messages.model';
import { Photo } from 'src/photos/photos.model';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';

@Injectable()
export class StatsService {

    constructor
    (
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Post) private postRepository: typeof Post,
        @InjectModel(Photo) private photoRepository: typeof Photo,
        @InjectModel(Message) private messageRepository: typeof Message,
    ) {}
     
    async getPostsNumber() 
    {
        return await this.postRepository.count().catch(error => console.log(error));
    }

    async getUsersNumber() 
    {
        return await this.userRepository.count().catch(error => console.log(error));
    }

    async getMessagesNumber() 
    {
        return await this.messageRepository.count().catch(error => console.log(error));
    }

    async getPhotosNumber() 
    {
        return await this.photoRepository.count().catch(error => console.log(error));
    }

}
