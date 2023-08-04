import { Injectable } from '@nestjs/common';
import { HttpService as Http } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NotificationService } from '../notification/notification.service';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { Report } from '../models/Report';
import * as https from 'https';

@Injectable()
export class HttpService {
  private readonly httpsAgentIgnoringSSLErrors: https.Agent;
  private readonly httpsAgent: https.Agent;

  private static MILLISECONDS_PER_SECOND = 1000;

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

    this.http.axiosRef.defaults.timeout = 5 * HttpService.MILLISECONDS_PER_SECOND;

    this.httpsAgentIgnoringSSLErrors = new https.Agent({
      rejectUnauthorized: false,
    });

    this.httpsAgent = new https.Agent();
  }

  private calculateDuration(response: AxiosResponse) {
    const timeInMilliseconds = new Date().getTime() - response.config.headers['start-time'];
    return timeInMilliseconds / HttpService.MILLISECONDS_PER_SECOND;
  }

  async check(urlCheck: UrlCheckDocument) {
    const url = HttpService.parseUrl(urlCheck);
    let { isUp, statusCode, responseTime } = await this.sendRequest(url, urlCheck);

    if (urlCheck.assert?.statusCode) {
      isUp = statusCode === urlCheck.assert.statusCode;
    }

    if (isUp !== urlCheck.isUp) {
      urlCheck.isUp = isUp;
      this.notificationService.sendAllNotifications(urlCheck, url.toString()).catch();
    }

    const report = urlCheck.report || new Report();

    if (isUp) {
      report.status = 'up';
      report.uptime += urlCheck.interval;
      report.availableRequestsCount++;
    } else {
      report.status = 'down';
      report.downtime += urlCheck.interval;
      report.unavailableRequestsCount++;
    }
    report.totalResponseTime += responseTime;

    report.history.push({ timestamp: new Date(), statusCode: statusCode, responseTime: responseTime });

    urlCheck.report = report;

    urlCheck.save().catch();
  }

  private async sendRequest(url: URL, urlCheck: UrlCheck) {
    let response: AxiosResponse;
    let isUp = true;
    let responseTime = urlCheck.timeout * HttpService.MILLISECONDS_PER_SECOND;

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
      timeout: urlCheck.timeout * 1000,
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
