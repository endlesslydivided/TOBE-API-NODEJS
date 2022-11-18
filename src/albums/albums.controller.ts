import { Body, Controller, forwardRef, Get, Inject, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AlbumsService } from "./albums.service";
import { Album } from "./albums.model";
import { CreateAlbumDto } from "./dto/createAlbum.dto";
import { UpdateAlbumDto } from "./dto/updateAlbum.dto";
import { PhotosService } from "src/photos/photos.service";

@ApiTags("Albums")
@Controller("albums")
export class AlbumsController {
  constructor(
    private albumService: AlbumsService,
    @Inject(forwardRef(() => PhotosService)) private photosService: PhotosService,
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

  @ApiOperation({ summary: "Update album by id" })
  @ApiOkResponse()
  @Put(`/:id/photos`)
  getPhotosByAlbum(@Param("id") id: number,
                  @Query("page") page: number,
                  @Query("limit") limit: number) {
    return this.photosService.getPagedPhotoByAlbum(id,limit, page);
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
