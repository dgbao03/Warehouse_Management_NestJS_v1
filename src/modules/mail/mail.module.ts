import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [MailService],
  imports: [UserModule],
  exports: [MailService]
})
export class MailModule {}
