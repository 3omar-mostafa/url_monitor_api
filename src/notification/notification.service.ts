import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { EmailNotificationService } from './providers/email/email-notification.service';
import * as process from 'process';
import { UrlCheckDocument } from '../models/UrlCheck';
import { WebhookNotificationService } from './providers/webhook/webhook-notification.service';
import { UsersService } from '../users/users.service';
import { UrlCheckService } from '../url-check/url-check.service';

@Injectable()
export class NotificationService {
  constructor(
    private emailNotificationService: EmailNotificationService,
    private webhookNotificationService: WebhookNotificationService,
    private userService: UsersService,
    private urlCheckService: UrlCheckService,
  ) {}

  async sendEmailVerification(user: User, verificationUrl: string | Promise<string>) {
    if (verificationUrl instanceof Promise) {
      verificationUrl = await verificationUrl;
    }
    const expirationTime = process.env.JWT_EXPIRATION_TIME;

    this.emailNotificationService.send(
      {
        subject: 'Email Verification',
        templatePath: 'email-verification.template.html',
        templateArgs: {
          firstName: user.firstName,
          verificationUrl: verificationUrl,
          expirationTime: expirationTime,
        },
      },
      {
        from: 'noreply@monitoring.com',
        to: user.email,
      },
    );
  }

  async sendEmailNotification(url: string, urlCheck: UrlCheckDocument) {
    const user = await this.userService.findById(urlCheck.user._id);
    if (!user) {
      return;
    }

    const status = urlCheck.isUp ? 'up' : 'down';

    this.emailNotificationService.send(
      {
        subject: '[Website Monitor] Status changed',
        templatePath: `website-status-${status}.template.html`,
        templateArgs: {
          firstName: user.firstName,
          url: url,
        },
      },
      {
        from: '"Url Monitor" <notifications@monitoring.com>',
        to: user.email,
      },
    );
  }

  async sendWebhookNotification(url: string, urlCheck: UrlCheckDocument) {
    const status = urlCheck.isUp ? 'up' : 'down';

    this.webhookNotificationService.send(
      {
        subject: '[Website Monitor] Status changed',
        message: `The url you are monitoring (${url}) is now ${status}`,
      },
      {
        webhookUrl: urlCheck.webhook,
      },
      {
        url: url,
        status: status,
      },
    );
  }

  async sendAllNotifications(urlCheck: UrlCheckDocument, url: string) {
    if (urlCheck.webhook) {
      this.sendWebhookNotification(url, urlCheck);
    }
    this.sendEmailNotification(url, urlCheck);
  }
}
