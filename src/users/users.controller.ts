import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { Roles } from "../auth/roleAuth.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AddRoleDto } from "./dto/addRole.dto";
import { ValidationPipe } from "../pipes/validation.pipe";

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private userService: UsersService
  )
  {}

  @ApiOperation({summary:"User creation"})
  @ApiResponse({status:200,type:User})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto)
  {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({summary:"Get all users"})
  @ApiResponse({status:200,type:[User]})
  @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @Get()
  getAll()
  {
    return this.userService.getAllUser();
  }

  // @ApiOperation({summary:"Delete album by userId"})
  // @ApiResponse({status:204,type:[User]})
  // @UseGuards(RolesGuard)
  // // @Roles("ADMIN")
  // @Delete('/:userId/albums/:albumId')
  // deleteAlbumByUser(@Param('userId') userId: number,@Param('albumId') albumId)
  // {
  //   return this.albumService.deleteById();
  // }

  @ApiOperation({summary:"Give user a role"})
  @ApiResponse({status:200})
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get('/role')
  addRole(@Body() dto: AddRoleDto)
  {
    return this.userService.addRole(dto);
  }
}
