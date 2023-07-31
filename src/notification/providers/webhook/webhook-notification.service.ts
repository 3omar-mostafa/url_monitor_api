import { Notification, NotificationMessage } from '../notification';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookNotificationService implements Notification {
  constructor(private httpService: HttpService) {}

  async send(message: NotificationMessage, options?, args?): Promise<any> {
    const data = {
      subject: message.subject,
      message: message.message,
      url: args.url,
      status: args.status,
    };
    return firstValueFrom(this.httpService.post(options.webhookUrl, data));
  }
}
