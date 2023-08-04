import { Injectable } from '@nestjs/common';
import { HttpService as Http } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NotificationService } from '../notification/notification.service';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { Report } from '../models/Report';
import * as https from 'https';
import { TimeUtils } from '../utils/time.utils';

@Injectable()
export class HttpService {
  private readonly httpsAgentIgnoringSSLErrors: https.Agent;
  private readonly httpsAgent: https.Agent;

  constructor(private http: Http, private notificationService: NotificationService) {
    this.http.axiosRef.interceptors.request.use((config) => {
      config.headers['start-time'] = new Date().getTime();
      return config;
    });

    this.http.axiosRef.interceptors.response.use(
      (response) => {
        response.config.headers['response-time'] = this.calculateDuration(response);
        response.config.headers['is-up'] = true;
        return response;
      },
      (error) => {
        if (error.response) {
          error.response.config.headers['response-time'] = this.calculateDuration(error.response);
          error.response.config.headers['is-up'] = false;
          return Promise.resolve(error.response);
        }
        return Promise.reject(error);
      },
    );

    this.http.axiosRef.defaults.timeout = TimeUtils.s_to_ms(5);

    this.httpsAgentIgnoringSSLErrors = new https.Agent({
      rejectUnauthorized: false,
    });

    this.httpsAgent = new https.Agent();
  }

  private calculateDuration(response: AxiosResponse) {
    const timeInMilliseconds = new Date().getTime() - response.config.headers['start-time'];
    return TimeUtils.ms_to_s(timeInMilliseconds);
  }

  async check(urlCheck: UrlCheckDocument) {
    const url = HttpService.parseUrl(urlCheck);
    let { isUp, statusCode, responseTime } = await this.sendRequest(url, urlCheck);

    if (urlCheck.assert?.statusCode) {
      isUp = statusCode === urlCheck.assert.statusCode;
    }

    urlCheck.consecutiveFailedRequestsCount = isUp ? 0 : urlCheck.consecutiveFailedRequestsCount + 1;

    if (
      (isUp === true && urlCheck.isUp === false) ||
      (isUp === false && urlCheck.consecutiveFailedRequestsCount >= urlCheck.threshold)
    ) {
      urlCheck.isUp = isUp;
      urlCheck.consecutiveFailedRequestsCount = 0;
      this.notificationService.sendAllNotifications(urlCheck, url.toString()).catch();
    }

    urlCheck.report = urlCheck.report || new Report();

    urlCheck.report.history.push({ timestamp: new Date(), statusCode: statusCode, responseTime: responseTime });

    if (isUp) {
      urlCheck.report.status = 'up';
      urlCheck.report.uptime += urlCheck.interval;
      urlCheck.report.availableRequestsCount++;
    } else {
      urlCheck.report.status = 'down';
      urlCheck.report.downtime += urlCheck.interval;
      urlCheck.report.unavailableRequestsCount++;
    }
    urlCheck.report.totalResponseTime += responseTime;

    urlCheck.save().catch();
  }

  private async sendRequest(url: URL, urlCheck: UrlCheck) {
    let response: AxiosResponse;
    let isUp = true;
    let responseTime = urlCheck.timeout;

    try {
      const options = this.getHttpOptions(urlCheck);

      response = await firstValueFrom(this.http.get(url.toString(), options));

      responseTime = response.config.headers['response-time'];
      isUp = response.config.headers['is-up'];
    } catch (e) {
      isUp = false;
    }
    const statusCode = response?.status;

    return { isUp, statusCode, responseTime };
  }

  private getHttpOptions(urlCheck: UrlCheck): AxiosRequestConfig {
    return {
      timeout: TimeUtils.s_to_ms(urlCheck.timeout),
      headers: urlCheck.httpHeaders,
      auth: urlCheck.authentication,
      httpsAgent: urlCheck.ignoreSSL ? this.httpsAgentIgnoringSSLErrors : this.httpsAgent,
    };
  }

  private static parseUrl(urlCheck: UrlCheck) {
    let url: URL;

    if (!urlCheck.url.startsWith('http')) {
      url = new URL(`http://${urlCheck.url}`);
    } else {
      url = new URL(urlCheck.url);
    }

    url.port = String(urlCheck.port);
    url.protocol = urlCheck.protocol;

    if (urlCheck.path) {
      url.pathname = urlCheck.path;
    }

    return url;
  }
}
