import { ConfigService } from '@nestjs/config';
import { Notification, NotificationMessage } from '../notification';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailNotificationService implements Notification {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_SERVER_PORT),
      secure: process.env.SMTP_FLAG_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(message: NotificationMessage, mailOptions?: Mail.Options, args?): Promise<any> {
    let htmlMessage = message.message;
    if (message.templatePath) {
      htmlMessage = await this.renderTemplate(message.templatePath, message.templateArgs);
    }

    const mailMessage: Mail.Options = {
      subject: message.subject,
      html: htmlMessage,
      ...mailOptions,
    };

    return this.transporter.sendMail(mailMessage);
  }

  private async renderTemplate(templatePath: string, templateArgs: object) {
    templatePath = path.join(__dirname, 'templates', templatePath);
    const sourceTemplate = await fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(sourceTemplate);
    return template(templateArgs);
  }
}
