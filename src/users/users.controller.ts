import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UsersService } from "./users.service";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { Roles } from "../auth/guards/roleAuth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AddRoleDto } from "./dto/addRole.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import { PostsService } from "../posts/posts.service";
import { PhotosService } from "../photos/photos.service";
import { AlbumsService } from "../albums/albums.service";
import { FriendsService } from "../friends/friends.service";
import { DialogsService } from "../dialogs/dialogs.service";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { Request } from "express";
import { AccessTokenGuard } from "../auth/guards/accessToken.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {

  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @Inject(forwardRef(() => PostsService)) private postsService: PostsService,
    @Inject(forwardRef(() => PhotosService)) private photosService: PhotosService,
    @Inject(forwardRef(() => AlbumsService)) private albumsService: AlbumsService,
    @Inject(forwardRef(() => DialogsService)) private dialogsService: DialogsService,
    @Inject(forwardRef(() => FriendsService)) private friendsService: FriendsService
  ) {
  }

  @ApiOperation({ summary: "User update" })
  @ApiCreatedResponse({ type: User })
  @UsePipes(ValidationPipe)
  @Put("/:id")
  updateUser(@Body() userDto: UpdateUserDto,@Param("id") id: number) 
  {
    return this.userService.updateUserById(id,userDto);
  }

  @ApiOperation({ summary: "Get paged users" })
  @ApiOkResponse({ type: "{rows:User[],count:number}" })
  //@UseGuards(RolesGuard)
  // @Roles("USER")
  @Get()
  getPagedUsers(@Query("page") page: number,
                @Query("limit") limit: number) {
    return this.userService.getPagedUsers(limit, page);
  }


  @ApiOperation({ summary: "Get paged user's friends" })
  @ApiOkResponse({ type: "{rows:Friends[],count:number}" })
  //@UseGuards(RolesGuard)
  // @Roles("USER")
  @Get("/:id/friends")
  getPagedFriendsByUser(@Param("id") id: number,
                        @Query("page") page: number,
                        @Query("limit") limit: number) {
    return this.friendsService.getPagedFriendsByUser(id, limit, page);
  }

  @ApiOperation({ summary: "Get paged user's albums" })
  @ApiOkResponse()
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @Get("/:id/albums")
  getPagedAlbumsByUser(@Param("id") id: number,
                       @Query("page") page: number,
                       @Query("limit") limit: number) {
    return this.albumsService.getPagedAlbumsByUser(id, limit, page);
  }

  @ApiOperation({ summary: "Get paged user's posts" })
  @ApiOkResponse({ type: "{rows:Post[],count:number}" })
  //@UseGuards(RolesGuard)
  //@Roles("USER")
  @Get("/:id/posts")
  getPagedPostsByUser(@Param("id") id: number,
                      @Query("page") page: number,
                      @Query("limit") limit: number) {
    return this.postsService.getPagedPostByUser(id, limit, page);
  }

  @ApiOperation({ summary: "Get paged user's posts" })
  @ApiOkResponse({ type: "{rows:Post[],count:number}" })
  //@UseGuards(RolesGuard)
  //@Roles("USER")
  @Get("/:id/dialogs")
  getPagedDialogsByUser(@Param("id") id: number,
                        @Query("page") page: number,
                        @Query("limit") limit: number) {
    return this.dialogsService.getPagedDialogsByUser(id, limit, page);
  }

  @ApiOperation({ summary: "Get paged user's subscriptions posts" })
  @ApiOkResponse({ type: "{rows:Post[],count:number}" })
  //@UseGuards(RolesGuard)
  //@Roles("USER")
  @Get("/:id/feed")
  getPagedSubsByUser(@Param("id") id: number,
                     @Query("page") page: number,
                     @Query("limit") limit: number) {
    return this.postsService.getPagedPostByUserSubscriptions(id, limit, page);
  }


  @ApiOperation({ summary: "Give user a role" })
  @ApiCreatedResponse()
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Post("/role")
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @ApiOperation({ summary: "Delete friend" })
  @ApiNoContentResponse()
  @UseInterceptors(TransactionInterceptor)
  @Delete("/:userId/friends/:id")
  deleteFriend(@Param("userId") userId: number,
               @Param("id") id: number,
               @TransactionParam() transaction: Transaction
  ) 
  {
    return this.friendsService.deleteFriend(userId, id, transaction);
  }
}
