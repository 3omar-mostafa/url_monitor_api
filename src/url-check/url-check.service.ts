import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UrlCheck } from '../models/UrlCheck';
import mongoose, { Model, ObjectId } from 'mongoose';
import { User } from '../models/User';

@Injectable()
export class UrlCheckService {
  constructor(@InjectModel(UrlCheck.name) private urlCheckModel: Model<UrlCheck>) {}

  async findOne(userId: ObjectId, urlCheckId: ObjectId): Promise<UrlCheck | null> {
    const urlCheck = await this.urlCheckModel.findById(urlCheckId).exec();
    if (urlCheck && urlCheck.user._id == userId) {
      return urlCheck;
    }
    throw new NotFoundException(`Url Check '${urlCheckId}' is not found`);
  }

  async findAll(userId: ObjectId): Promise<UrlCheck[] | null> {
    return this.urlCheckModel.find({ user: userId }).exec();
  }

  async create(urlCheck: UrlCheck): Promise<UrlCheck | null> {
    return this.urlCheckModel.create(urlCheck);
  }

  async update(user: User, urlCheck: UrlCheck): Promise<UrlCheck | null> {
    const urlCheckId = urlCheck.id;
    const originalUrlCheck = await this.urlCheckModel.findOne(user.id, urlCheckId);
    if (!originalUrlCheck) {
      throw new NotFoundException(`UrlCheck '${urlCheckId}' is not found`);
    }

    urlCheck = { ...urlCheck, id: urlCheckId, user: user };
    return originalUrlCheck.updateOne(urlCheck, { new: true }).exec();
  }

  async delete(userId: ObjectId, urlCheckId: ObjectId): Promise<any> {
    const urlCheck = await this.urlCheckModel.findById(urlCheckId).exec();
    if (urlCheck && urlCheck.user._id == userId) {
      return urlCheck.deleteOne();
    }
    throw new NotFoundException(`Url Check '${urlCheckId}' is not found`);
  }

  async deleteAll(userId: ObjectId): Promise<any> {
    return this.urlCheckModel.deleteMany({ user: userId }).exec();
  }
}
