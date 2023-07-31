import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './providers/email/email-notification.service';

@Module({
  providers: [NotificationService, EmailNotificationService],
  exports: [NotificationService, EmailNotificationService],
})
export class NotificationModule {}
