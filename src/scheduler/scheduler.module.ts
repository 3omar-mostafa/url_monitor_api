import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { HttpModule } from '../http/http.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlCheck, UrlCheckSchema } from '../models/UrlCheck';

@Module({
  imports: [HttpModule, ScheduleModule, MongooseModule.forFeature([{ name: UrlCheck.name, schema: UrlCheckSchema }])],

  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
