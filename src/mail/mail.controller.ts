import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { SendMailDto } from './dto/sendMail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {

    constructor(private mailService:MailService)
    {

    }

    @UseGuards(AccessTokenGuard)
    @Post('/send')
    sendMail(@Body() dto: SendMailDto) 
    {
        return this.mailService.sendMails(dto);
    }
}
