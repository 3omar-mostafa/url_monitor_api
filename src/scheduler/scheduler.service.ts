import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '../http/http.service';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private static schedulerRegistry: SchedulerRegistry;
  private static httpService: HttpService;

  constructor(
    schedulerRegistry: SchedulerRegistry,
    httpService: HttpService,
    @InjectModel(UrlCheck.name) private urlCheckModel: Model<UrlCheck>,
  ) {
    SchedulerService.schedulerRegistry = schedulerRegistry;
    SchedulerService.httpService = httpService;
  }

  async onModuleInit() {
    console.log(`App restarted, will restart all scheduled url checks`);

    const urlChecks = await this.urlCheckModel.find();
    for (const urlCheck of urlChecks) {
      SchedulerService.add(urlCheck);
    }

    console.log(`Finished importing all url checks to scheduler service`);
  }

  static add(urlCheck: UrlCheckDocument) {
    const intervalCallBack = setInterval(async () => {
      await SchedulerService.httpService.check(urlCheck);
    }, urlCheck.interval);
    this.schedulerRegistry.addInterval(urlCheck.id.toString(), intervalCallBack);
  }

  static update(urlCheck: UrlCheckDocument) {
    this.remove(urlCheck);
    this.add(urlCheck);
  }

  static remove(urlCheck: UrlCheckDocument) {
    this.schedulerRegistry.deleteInterval(urlCheck.id.toString());
  }
}
