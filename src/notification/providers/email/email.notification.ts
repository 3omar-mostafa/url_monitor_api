import { ConfigService } from '@nestjs/config';
import { Notification, NotificationMessage } from '../notification';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';

export class EmailNotification implements Notification {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
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

  async send(from: string, to: string, message: NotificationMessage, mailOptions?: Mail.Options, args?): Promise<any> {
    let htmlMessage = message.message;
    if (message.templatePath) {
      htmlMessage = await this.renderTemplate(message.templatePath, message.templateArgs);
    }

    const mailMessage: Mail.Options = {
      from: from,
      to: to,
      subject: message.subject,
      html: htmlMessage,
      ...mailOptions,
    };

    return this.transporter.sendMail(mailOptions);
  }

  private async renderTemplate(templatePath: string, templateArgs: object) {
    const sourceTemplate = await readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(sourceTemplate);
    return template(templateArgs);
  }
}
