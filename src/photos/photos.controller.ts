import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TransactionInterceptor } from "../interceptors/transaction.interceptor";
import { FilesInterceptor } from "@nestjs/platform-express";
import { TransactionParam } from "../decorators/transactionParam.decorator";
import { Transaction } from "sequelize";
import { PhotosService } from "./photos.service";
import { CreatePhotoDto } from "./dto/createPhoto.dto";
import { UpdatePhotoDto } from "./dto/updatePhoto.dto";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Photo } from "./photos.model";
import { FormDataRequest } from "nestjs-form-data";

@ApiTags("Photos")
@Controller("photos")
export class PhotosController {

  constructor(private photosService: PhotosService) {
  }

  @ApiOperation({ summary: "Photo creation" })
  @ApiCreatedResponse({ type: Photo })
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest()
  @Post()
  createPhoto(@Body() dto: CreatePhotoDto,
              @TransactionParam() transaction: Transaction
  ) 
  {
    return this.photosService.createPhoto(dto, transaction, dto.file);
  }

  @ApiOperation({ summary: "Photo update" })
  @ApiOkResponse()
  @UseInterceptors(TransactionInterceptor)
  @Put("/:id")
  updatePhoto(@Param("id") id: number,
              @Body() dto: UpdatePhotoDto,
              @TransactionParam() transaction: Transaction) {
    return this.photosService.updatePhoto(id, dto, transaction);
  }

  @ApiOperation({ summary: "Photo delete" })
  @ApiNoContentResponse()
  @Delete("/:id")
  deletePhoto(@Param("id") id: number) {
    return this.photosService.deletePhoto(id);
  }

  @ApiOperation({ summary: "Get one photo" })
  @ApiOkResponse({ type: Photo })
  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.photosService.getById(id);
  }
}
