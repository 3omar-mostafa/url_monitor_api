import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import JwtKeysConfig from './config/JwtKeysConfig';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [JwtKeysConfig] }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
