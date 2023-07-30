import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '../http/http.service';
import { UrlCheck } from '../models/UrlCheck';

@Injectable()
export class SchedulerService {
  private static schedulerRegistry: SchedulerRegistry;
  private static httpService: HttpService;

  constructor(schedulerRegistry: SchedulerRegistry, httpService: HttpService) {
    SchedulerService.schedulerRegistry = schedulerRegistry;
    SchedulerService.httpService = httpService;
  }

  static add(urlCheck: UrlCheck) {
    const intervalCallBack = setInterval(async () => {
      await SchedulerService.httpService.get(urlCheck);
    }, urlCheck.interval);
    this.schedulerRegistry.addInterval(urlCheck.id.toString(), intervalCallBack);
  }

  static update(urlCheck: UrlCheck) {
    this.remove(urlCheck);
    this.add(urlCheck);
  }

  static remove(urlCheck: UrlCheck) {
    this.schedulerRegistry.deleteInterval(urlCheck.id.toString());
  }
}
