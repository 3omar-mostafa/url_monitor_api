export class NotificationMessage {
  subject: string;
  message?: string;
  templatePath?: string;
  templateArgs?: object;
}

export interface Notification {
  send(from: string, to: string, message: NotificationMessage, options?, args?): Promise<any>;
}
