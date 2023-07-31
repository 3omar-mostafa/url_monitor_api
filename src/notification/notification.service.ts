import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { JwtService } from '@nestjs/jwt';
import { EmailNotificationService } from './providers/email/email-notification.service';
import * as process from 'process';
import { UrlCheckDocument } from '../models/UrlCheck';

@Injectable()
export class NotificationService {
  constructor(private emailNotificationService: EmailNotificationService) {}

  async sendVerificationEmail(user: User, verificationUrl: string | Promise<string>) {
    if (verificationUrl instanceof Promise) {
      verificationUrl = await verificationUrl;
    }
    const expirationTime = process.env.JWT_EXPIRATION_TIME;

    await this.emailNotificationService.send(
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
        from: '"Omar Hafez" <ohafez@bosta.com>',
        to: user.email,
      },
    );
  }

  async sendNotifications(urlCheck: UrlCheckDocument, url: string) {}
}
