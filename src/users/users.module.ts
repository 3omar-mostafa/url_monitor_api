import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSchema } from '../models/User';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from '../models/constants';

@Module({
  imports: [MongooseModule.forFeature([{ name: Models.USER, schema: UserSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
