import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";
import { Roles } from "../auth/roleAuth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private userService: UsersService
  )
  {}

  @ApiOperation({summary:"User creation"})
  @ApiResponse({status:200,type:User})
  @Post()
  create(@Body() userDto: CreateUserDto)
  {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({summary:"Get all users"})
  @ApiResponse({status:200,type:[User]})
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get()
  getAll()
  {
    return this.userService.getAllUser();
  }
}
