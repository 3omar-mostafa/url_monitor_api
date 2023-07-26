import { Module } from '@nestjs/common';
import { HttpModule as Http } from '@nestjs/axios';
import { HttpService } from './http.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [Http, NotificationModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
