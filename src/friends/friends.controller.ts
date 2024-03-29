import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { FriendsService } from "./friends.service";
import { CreateFriendDto } from "./dto/createFriend.dto";
import { Friend } from "./friends.model";
import { UpdateFriendDto } from "./dto/updateFriend.dto";

@ApiTags("Friends")
@Controller("friends")
export class FriendsController {

  constructor(private friendsService: FriendsService) {
  }

  @ApiOperation({ summary: "Friend creation" })
  @ApiCreatedResponse({ type: Friend })
  @UseInterceptors(TransactionInterceptor)
  @Post()
  createFriend(@Body() dto: CreateFriendDto,@TransactionParam() transaction: Transaction
  ) {
    return this.friendsService.createFriend(dto, transaction);
  }

  @ApiOperation({ summary: "Update friend" })
  @ApiOkResponse()
  @UseInterceptors(TransactionInterceptor)
  @Put("/:id")
  updateFriend(@Param("id") id: number,
               @Body() dto: UpdateFriendDto,
               @TransactionParam() transaction: Transaction) {
    return this.friendsService.updateFriend(id, dto, transaction);
  }

  @ApiOperation({ summary: "Delete friend" })
  @ApiOkResponse()
  @UseInterceptors(TransactionInterceptor)
  @Delete("/:id")
  deleteFriend(@Param("id") id: number,@TransactionParam() transaction: Transaction) {
    return this.friendsService.deleteFriend(id, transaction);
  }

}
