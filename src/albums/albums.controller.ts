import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.model";
import { ValidationPipe } from "../pipes/validation.pipe";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roleAuth.decorator";
import { AddRoleDto } from "../users/dto/addRole.dto";
import { AlbumsService } from "./albums.service";
import { Album } from "./albums.model";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    private albumService: AlbumsService
  )
  {}

  @ApiOperation({summary:"Album creation"})
  @ApiResponse({status:200,type:Album})
  @UsePipes(ValidationPipe)
  @Post()
  createAlbum(@Body() albumDto: CreateAlbumDto)
  {
    return this.albumService.createAlbum(albumDto);
  }

  @ApiOperation({summary:"Update album by id"})
  @ApiResponse({status:200,type:Album})
  @Put(`/:id`)
  updateAlbum(@Body() albumDto: UpdateAlbumDto,@Param('id') id:number)
  {
    return this.albumService.updateAlbum(id,albumDto);
  }

  @ApiOperation({summary:"Give user a role"})
  @ApiResponse({status:200})
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get('/:id')
  deleteAlbum(@Param('id') id:number)
  {
    return this.albumService.deleteAlbum(id);
  }
}
