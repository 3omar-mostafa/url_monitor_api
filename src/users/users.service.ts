import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async create(user: User): Promise<User | undefined> {
    return this.userModel.create(user);
  }
}
