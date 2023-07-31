import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../models/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
