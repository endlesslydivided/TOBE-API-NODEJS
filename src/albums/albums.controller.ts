import { Body, Controller, Get, Param, Post, Put, UsePipes } from "@nestjs/common";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AlbumsService } from "./albums.service";
import { Album } from "./albums.model";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";

@ApiTags("Albums")
@Controller("albums")
export class AlbumsController {
  constructor(
    private albumService: AlbumsService
  ) {
  }

  @ApiOperation({ summary: "Album creation" })
  @ApiCreatedResponse({ type: Album })
  @UsePipes(ValidationPipe)
  @Post()
  createAlbum(@Body() albumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(albumDto);
  }

  @ApiOperation({ summary: "Update album by id" })
  @ApiOkResponse()
  @Put(`/:id`)
  updateAlbum(@Body() albumDto: UpdateAlbumDto, @Param("id") id: number) {
    return this.albumService.updateAlbum(id, albumDto);
  }

  @ApiOperation({ summary: "Delete album by id" })
  @ApiNoContentResponse()
  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  @Get("/:id")
  deleteAlbum(@Param("id") id: number) {
    return this.albumService.deleteAlbum(id);
  }
}
