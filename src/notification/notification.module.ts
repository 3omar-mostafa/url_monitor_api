import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './providers/email/email-notification.service';
import { WebhookNotificationService } from './providers/webhook/webhook-notification.service';
import { UsersModule } from '../users/users.module';
import { UrlCheckModule } from '../url-check/url-check.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, UsersModule, UrlCheckModule],
  providers: [NotificationService, EmailNotificationService, WebhookNotificationService],
  exports: [NotificationService, EmailNotificationService, WebhookNotificationService],
})
export class NotificationModule {}
