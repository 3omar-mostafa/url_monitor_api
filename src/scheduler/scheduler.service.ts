import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '../http/http.service';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Models } from '../models/constants';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private static schedulerRegistry: SchedulerRegistry;
  private static httpService: HttpService;

  constructor(
    schedulerRegistry: SchedulerRegistry,
    httpService: HttpService,
    @InjectModel(Models.URL_CHECK) private urlCheckModel: Model<UrlCheck>,
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
    const intervalID = urlCheck.id.toString();

    if (this.schedulerRegistry.doesExist('interval', intervalID)) {
      return;
    }

    const callback = async () => {
      await SchedulerService.httpService.check(urlCheck);
    };

    // setInterval will call the callback after the interval has passed, not immediately, so we call it immediately once
    callback();

    const intervalCallBack = setInterval(callback, urlCheck.interval);
    this.schedulerRegistry.addInterval(intervalID, intervalCallBack);
  }

  static update(urlCheck: UrlCheckDocument) {
    this.remove(urlCheck);
    this.add(urlCheck);
  }

  static remove(urlCheck: UrlCheckDocument) {
    const intervalID = urlCheck.id.toString();

    if (!this.schedulerRegistry.doesExist('interval', intervalID)) {
      return;
    }

    this.schedulerRegistry.deleteInterval(intervalID);
  }
}
