import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { HttpModule } from './http/http.module';
import { NotificationModule } from './notification/notification.module';
import JwtKeysConfig from './config/JwtKeysConfig';
import MongooseConfig from './config/MongooseConfig';
import { ScheduleModule } from '@nestjs/schedule';
import { UrlCheckModule } from './url-check/url-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [JwtKeysConfig, MongooseConfig] }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UsersModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    HttpModule,
    NotificationModule,
    UrlCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
