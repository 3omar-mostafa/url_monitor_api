import { Injectable } from '@nestjs/common';
import { HttpService as Http } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { NotificationService } from '../notification/notification.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UrlCheck } from '../models/UrlCheck';

@Injectable()
export class HttpService {
  constructor(
    private http: Http,
    private notificationService: NotificationService,
    @InjectModel(UrlCheck.name) private urlCheckModel: Model<UrlCheck>,
  ) {
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

  async get(urlCheck: UrlCheck, options?) {
    try {
      const response: AxiosResponse = await firstValueFrom(this.http.get(urlCheck.url, options));
      const requestDuration: number = response.config.headers['request-duration'];
      console.log(`Tested ${urlCheck.url}, responded in ${requestDuration}ms`);
    } catch (e) {
      console.log(e);
    }

    // TODO: Process and store in the database

    // this.notifications.sendNotifications(userId, url, status);
  }
}
