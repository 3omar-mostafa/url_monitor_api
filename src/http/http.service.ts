import { Injectable } from '@nestjs/common';
import { HttpService as Http } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class HttpService {
  constructor(private http: Http, private notificationService: NotificationService) {
    this.http.axiosRef.interceptors.request.use((config) => {
      config.headers['start-time'] = new Date().getTime();
      return config;
    });

    this.http.axiosRef.interceptors.response.use((response) => {
      response.config.headers['request-duration'] = new Date().getTime() - response.config.headers['start-time'];
      return response;
    });

    this.http.axiosRef.defaults.timeout = 5000;
  }

  async get(url: string, userId: string, options?) {
    try {
      const response: AxiosResponse = await firstValueFrom(this.http.get(url, options));
      const requestDuration: number = response.headers['request-duration'];
    } catch (e) {
      console.log(e);
    }

    // TODO: Process and store in the database

    // this.notifications.sendNotifications(userId, url, status);
  }
}
