import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '../http/http.service';

@Injectable()
export class SchedulerService {
  constructor(private schedulerRegistry: SchedulerRegistry, private httpService: HttpService) {}

  add(userId: string, url: string, interval: number) {
    // const intervalCallBack = setInterval();
    // this.schedulerRegistry.addInterval(`${userId}_${url}`, intervalCallBack);
  }
}
