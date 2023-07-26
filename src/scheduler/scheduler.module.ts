import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { HttpModule } from '../http/http.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, ScheduleModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
