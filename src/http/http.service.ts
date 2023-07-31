import { Injectable } from '@nestjs/common';
import { HttpService as Http } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NotificationService } from '../notification/notification.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UrlCheck } from '../models/UrlCheck';
import * as https from 'https';

@Injectable()
export class HttpService {
  private httpsAgentIgnoringSSLErrors: https.Agent;
  private httpsAgent: https.Agent;

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

    this.httpsAgentIgnoringSSLErrors = new https.Agent({
      rejectUnauthorized: false,
    });

    this.httpsAgent = new https.Agent();
  }

  async get(urlCheck: UrlCheck) {
    let response: AxiosResponse;
    let isUp = true;
    let url: URL;
    try {
      url = new URL(urlCheck.url);
      url.port = String(urlCheck.port);
      url.protocol = urlCheck.protocol;
      if (urlCheck.path) {
        url.pathname = urlCheck.path;
      }

      const options: AxiosRequestConfig = {
        timeout: urlCheck.timeout,
        headers: urlCheck.httpHeaders,
        auth: urlCheck.authentication,
        httpsAgent: urlCheck.ignoreSSL ? this.httpsAgentIgnoringSSLErrors : this.httpsAgent,
      };

      response = await firstValueFrom(this.http.get(url.toString(), options));
      const requestDuration: number = response.config.headers['request-duration'];
      console.log(`Tested ${urlCheck.url}, responded in ${requestDuration}ms`);
    } catch (e) {
      console.log(e);
      isUp = false;
    }

    if (urlCheck.assert?.statusCode && response?.status !== urlCheck.assert.statusCode) {
      isUp = false;
    }

    if (isUp !== urlCheck.isUp) {
      // this.notifications.sendNotifications(userId, url, status);
    }
  }
}
