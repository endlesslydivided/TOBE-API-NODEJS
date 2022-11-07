import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'rfrfirf2002@gmail.com',
          pass: 'WhyCantICry2020#',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
