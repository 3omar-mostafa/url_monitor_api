import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../models/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Models } from '../models/constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Models.USER) private userModel: Model<User>) {}

  async findOne(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: ObjectId): Promise<UserDocument | undefined> {
    return this.userModel.findById(id).exec();
  }

  async create(user: User): Promise<UserDocument | undefined> {
    return this.userModel.create(user);
  }
}
