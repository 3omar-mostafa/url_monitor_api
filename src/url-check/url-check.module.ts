import { Module } from '@nestjs/common';
import { UrlCheckService } from './url-check.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlCheckSchema } from '../models/UrlCheck';
import { UrlCheckController } from './url-check.controller';
import { JwtModule } from '../jwt/jwt.module';
import { Models } from '../models/constants';

@Module({
  imports: [JwtModule, MongooseModule.forFeature([{ name: Models.URL_CHECK, schema: UrlCheckSchema }])],
  providers: [UrlCheckService],
  exports: [UrlCheckService, MongooseModule],
  controllers: [UrlCheckController],
})
export class UrlCheckModule {}
