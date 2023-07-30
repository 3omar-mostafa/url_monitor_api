import { Module } from '@nestjs/common';
import { HttpModule as Http } from '@nestjs/axios';
import { HttpService } from './http.service';
import { NotificationModule } from '../notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlCheck, UrlCheckSchema } from '../models/UrlCheck';

@Module({
  imports: [Http, NotificationModule, MongooseModule.forFeature([{ name: UrlCheck.name, schema: UrlCheckSchema }])],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
