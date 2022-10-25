import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AlbumsService } from "./albums.service";
import { Album } from "./albums.model";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    private albumService: AlbumsService
  )
  {}

  @ApiOperation({summary:"Album creation"})
  @ApiResponse({status:201,type:Album})
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createAlbum(@Body() albumDto: CreateAlbumDto)
  {
    return this.albumService.createAlbum(albumDto);
  }

  @ApiOperation({summary:"Update album by id"})
  @ApiResponse({status:200,type:Album})
  @HttpCode(HttpStatus.OK)
  @Put(`/:id`)
  updateAlbum(@Body() albumDto: UpdateAlbumDto,@Param('id') id:number)
  {
    return this.albumService.updateAlbum(id,albumDto);
  }

  @ApiOperation({summary:"Delete album by id"})
  @ApiResponse({status:204})
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/:id')
  deleteAlbum(@Param('id') id:number)
  {
    return this.albumService.deleteAlbum(id);
  }
}
