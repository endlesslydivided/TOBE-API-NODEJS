import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/sendMail.dto';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User, emailToken: string) {
      const url = `http://localhost:${process.env.PORT}/auth/confirm?token=${emailToken}`;
  
      await this.mailerService.sendMail(
    {
        to: user.email,
        from: '"Служба поддержки" <support@example.com>', 
        subject: 'Добро пожаловать в ToBe! Необходимо подтвердить свою почту.',
        text:`Здравйствуйте,${user.lastName} ${user.firstName}.\n\n Для подтверждения почты перейдите по ссылке:\n ${url}`
      });
    }

    async sendMails(dto:SendMailDto) {
  
      
      return await dto.emails.map(async (x) => await this.mailerService.sendMail(
        {
          to: x,
          from: '"Служба поддержки" <support@example.com>', 
          subject: dto.title,
          text:dto.message
        })
      ).length;
    }
}
