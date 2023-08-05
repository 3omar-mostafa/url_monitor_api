import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [JwtKeysConfig, MongooseConfig], isGlobal: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    HttpModule,
    NotificationModule,
    UrlCheckModule,
    JwtModule,
  ],
})
export class AppModule {}
