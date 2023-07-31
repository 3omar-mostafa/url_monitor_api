export class NotificationMessage {
  subject: string;
  message?: string;
  templatePath?: string;
  templateArgs?: object;
}

export interface Notification {
  send(message: NotificationMessage, options?, args?): Promise<any>;
}
