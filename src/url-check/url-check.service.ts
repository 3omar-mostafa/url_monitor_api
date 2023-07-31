import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { Model, ObjectId } from 'mongoose';
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

  async findAll(userId: ObjectId): Promise<UrlCheckDocument[] | null> {
    return this.urlCheckModel.find({ user: userId }).exec();
  }

  async create(urlCheck: UrlCheck): Promise<UrlCheckDocument | null> {
    return this.urlCheckModel.create(urlCheck);
  }

  async update(user: User, urlCheck: UrlCheck): Promise<UrlCheckDocument | null> {
    const urlCheckId = urlCheck.id;
    urlCheck._id = urlCheckId;
    urlCheck.user = user;

    const updatedUrlCheck = await this.urlCheckModel.findByIdAndUpdate(urlCheckId, urlCheck, { new: true });
    if (!updatedUrlCheck) {
      throw new NotFoundException(`UrlCheck '${urlCheckId}' is not found`);
    }

    return updatedUrlCheck;
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
