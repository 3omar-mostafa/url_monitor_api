import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UrlCheck, UrlCheckDocument } from '../models/UrlCheck';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '../jwt/jwt.service';
import { Models } from '../models/constants';
import { CreateUrlCheckDto } from '../models/dto/url_check/createUrlCheckDto';
import { UpdateUrlCheckDto } from '../models/dto/url_check/updateUrlCheckDto';
import { Report } from '../models/Report';
import { ReturnMultiReportsDto } from '../models/dto/report/returnMultiReportsDto';

@Injectable()
export class UrlCheckService {
  constructor(private jwtService: JwtService, @InjectModel(Models.URL_CHECK) private urlCheckModel: Model<UrlCheck>) {}

  async findOne(userId: ObjectId | string, urlCheckId: ObjectId | string): Promise<UrlCheckDocument | null> {
    const urlCheck = await this.urlCheckModel.findById(urlCheckId).select('-report').exec();
    if (urlCheck && urlCheck.user._id == userId) {
      return urlCheck;
    }
    throw new NotFoundException(`Url Check '${urlCheckId}' is not found`);
  }

  async findReport(userId: ObjectId | string, urlCheckId: ObjectId | string): Promise<Report | null> {
    const urlCheck = await this.urlCheckModel.findById(urlCheckId).select(['report', 'user']).exec();
    if (urlCheck && urlCheck.user._id == userId) {
      return urlCheck.report;
    }
    throw new NotFoundException(`Url Check Report '${urlCheckId}' is not found`);
  }

  async findReportsByTag(userId: ObjectId | string, tag: string): Promise<ReturnMultiReportsDto[] | null> {
    const urlChecks = await this.urlCheckModel
      .find({ user: userId, tags: tag, report: { $ne: null } })
      .select(['url', 'report'])
      .exec();

    return urlChecks.map((urlCheck: UrlCheck) => {
      return {
        id: urlCheck.id,
        url: urlCheck.url,
        report: urlCheck.report,
      };
    });
  }

  async findAll(userId: ObjectId): Promise<UrlCheckDocument[] | null> {
    return this.urlCheckModel.find({ user: userId }).select('-report').exec();
  }

  async create(userId: ObjectId | string, urlCheck: CreateUrlCheckDto): Promise<UrlCheckDocument | null> {
    return this.urlCheckModel.create({ ...urlCheck, user: userId });
  }

  async update(
    userId: ObjectId | string,
    urlCheckId: ObjectId | string,
    urlCheck: UpdateUrlCheckDto,
  ): Promise<UrlCheckDocument | null> {
    const updatedUrlCheck = await this.urlCheckModel.findOneAndUpdate({ _id: urlCheckId, user: userId }, urlCheck, {
      new: true,
    });

    if (!updatedUrlCheck) {
      throw new NotFoundException(`UrlCheck '${urlCheckId}' is not found`);
    }

    return updatedUrlCheck;
  }

  async delete(userId: ObjectId | string, urlCheckId: ObjectId | string): Promise<any> {
    const urlCheck = await this.urlCheckModel.findById(urlCheckId).select('user').exec();
    if (urlCheck && urlCheck.user._id == userId) {
      return urlCheck.deleteOne();
    }
    throw new NotFoundException(`Url Check '${urlCheckId}' is not found`);
  }

  async deleteAll(userId: ObjectId): Promise<any> {
    return this.urlCheckModel.deleteMany({ user: userId }).exec();
  }

  async generateUrlCheckUnsubscribeUrl(userId: ObjectId | string, urlCheckId: ObjectId | string): Promise<string> {
    const jwtPayload = {
      urlCheckId: urlCheckId,
      userId: userId,
    };

    const token = await this.jwtService.generateJwtToken(null, jwtPayload);

    const url = new URL(process.env.HOST_DOMAIN);
    url.pathname = '/url-check/unsubscribe';
    url.port = process.env.PORT;
    url.searchParams.append('token', token);
    return url.toString();
  }

  async unsubscribe(token: string) {
    const jwtPayload = this.jwtService.verify(token);

    if (!jwtPayload) {
      throw new BadRequestException('Invalid token');
    }

    await this.delete(jwtPayload.userId, jwtPayload.urlCheckId);

    return {
      status: 'success',
      message: 'You have successfully unsubscribed',
    };
  }
}
