import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './providers/email/email-notification.service';
import { UsersModule } from '../users/users.module';
import { UrlCheckModule } from '../url-check/url-check.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [NotificationService, EmailNotificationService],
  exports: [NotificationService, EmailNotificationService],
  imports: [HttpModule, UsersModule, UrlCheckModule],
})
export class NotificationModule {}
