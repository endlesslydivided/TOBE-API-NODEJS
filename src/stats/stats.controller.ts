import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Roles } from 'src/auth/guards/roleAuth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {

     constructor(
    private statsService: StatsService
  ) {
  }

    @ApiOperation({ summary: "Get posts number" })
    @ApiOkResponse({ type: Number })
    //@UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @Get("/posts")
    getPostsStats() 
    {
      return this.statsService.getPostsNumber();
    }

    @ApiOperation({ summary: "Get photos number" })
    @ApiOkResponse({ type: Number })
    //@UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @Get("/photos")
    getPhotosStats() 
    {
      return this.statsService.getPhotosNumber();
    }

    @ApiOperation({ summary: "Get messages number" })
    @ApiOkResponse({ type: Number })
    //@UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @Get("/messages")
    getMessagesStats() 
    {
      return this.statsService.getMessagesNumber();
    }

    @ApiOperation({ summary: "Get users number" })
    @ApiOkResponse({ type: Number })
    //@UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @Get("/users")
    getUsersStats() 
    {
      return this.statsService.getUsersNumber();
    }
}
