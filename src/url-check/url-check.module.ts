import { Module } from '@nestjs/common';
import { UrlCheckService } from './url-check.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlCheck, UrlCheckSchema } from '../models/UrlCheck';
import { UrlCheckController } from './url-check.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UrlCheck.name, schema: UrlCheckSchema }])],
  providers: [UrlCheckService],
  exports: [UrlCheckService],
  controllers: [UrlCheckController],
})
export class UrlCheckModule {}
