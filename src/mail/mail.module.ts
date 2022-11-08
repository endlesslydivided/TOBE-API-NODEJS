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
          user: 'tobesocialweb@gmail.com',
          pass: 'ijjjplrgapayfdyp',
        },
      },
      defaults: {
        from: '"No Reply" tobesocialweb@gmail.com',
      },
    
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
