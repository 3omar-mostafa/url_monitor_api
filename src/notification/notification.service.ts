import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { JwtService } from '@nestjs/jwt';
import { EmailNotificationService } from './providers/email/email-notification.service';
import * as process from 'process';

@Injectable()
export class NotificationService {
  constructor(private emailNotificationService: EmailNotificationService) {}

  async sendVerificationEmail(user: User, verificationUrl: string | Promise<string>) {
    if (verificationUrl instanceof Promise) {
      verificationUrl = await verificationUrl;
    }
    const expirationTime = process.env.JWT_EXPIRATION_TIME;

    await this.emailNotificationService.send('"Omar Hafez" <ohafez@bosta.com>', user.email, {
      subject: 'Email Verification',
      templatePath: 'email-verification.template.html',
      templateArgs: {
        verificationUrl: verificationUrl,
        expirationTime: expirationTime,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }
}
