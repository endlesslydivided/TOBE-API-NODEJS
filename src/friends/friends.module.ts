import { forwardRef, Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UsersModule } from "../users/users.module";
import { Friend } from "./friends.model";

@Module({
  providers: [FriendsService],
  controllers: [FriendsController],
  imports:
    [
      SequelizeModule.forFeature([Friend, User]),
      forwardRef(() => UsersModule)
    ],
  exports:
    [
      FriendsService
    ]
})
export class FriendsModule {
}
