import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { HttpModule } from '../http/http.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlCheckSchema } from '../models/UrlCheck';
import { Models } from '../models/constants';

@Module({
  imports: [
    HttpModule,
    ScheduleModule,
    MongooseModule.forFeature([
      {
        name: Models.URL_CHECK,
        schema: UrlCheckSchema,
      },
    ]),
  ],

  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
