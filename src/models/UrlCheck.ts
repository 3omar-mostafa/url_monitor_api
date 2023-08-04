import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from './User';
import { SchedulerService } from '../scheduler/scheduler.service';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { Report, ReportSchema } from './Report';
import { Models } from './constants';
import { TimeUtils } from '../utils/time.utils';

export type UrlCheckDocument = HydratedDocument<UrlCheck>;

@Schema({ _id: false })
export class AuthenticationType {
  @Prop()
  @IsNotEmpty()
  username: string;

  @Prop()
  @IsNotEmpty()
  password: string;
}

const AuthenticationTypeSchema = SchemaFactory.createForClass(AuthenticationType);

@Schema({ _id: false })
export class AssertType {
  @Prop()
  @IsInt()
  @IsEnum(HttpStatus)
  statusCode: number;
}

const AssertTypeSchema = SchemaFactory.createForClass(AssertType);

// =================================================================

@Schema()
export class UrlCheck {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  id: ObjectId;

  /**
   * Name used to describe the url
   */
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  /**
   * Url to make polling requests to check its status
   */
  @Prop({ required: true })
  @IsUrl()
  url: string;

  /**
   * Protocol used to make polling requests
   * @default http
   */
  @Prop({ required: true, enum: ['http', 'https', 'tcp'], default: 'http' })
  @IsIn(['http', 'https', 'tcp'])
  @Transform((params) => params.value.toLowerCase())
  protocol: string;

  /**
   * Custom path to be added to the URL
   *
   * @example
   * path: "/users"
   */
  @Prop()
  @IsOptional()
  path?: string;

  /**
   * Port used to make polling requests
   * @default 80 (http)
   */
  @Prop({ default: 80, min: 0, max: 65535 })
  @Min(0)
  @Max(65535)
  @IsInt()
  @IsOptional()
  port?: number;

  /**
   * Webhook url, to send notifications containing url status updates
   */
  @Prop()
  @IsUrl()
  @IsOptional()
  webhook?: string;

  /**
   * Timeout, in seconds, to wait for the url server to respond
   *
   * @default 5 seconds
   */
  @Prop({ default: 5 })
  @IsInt()
  @Min(1)
  @IsOptional()
  timeout?: number;

  /**
   * Interval, in seconds, between polling requests to check url
   *
   * @min 5 seconds
   * @default 10 minutes
   */
  @Prop({ default: TimeUtils.m_to_s(10), min: 5 })
  @IsInt()
  @Min(5)
  @IsOptional()
  interval?: number;

  /**
   * The number of polling requests that should fail before considering the url down, and sending notifications
   *
   * @min 1 failure
   * @default 1 failure
   */
  @Prop({ default: 1, min: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  threshold?: number;

  /**
   * Authentication (username, password) used to authenticate during polling requests
   */
  @Prop({ type: AuthenticationTypeSchema })
  @IsObject()
  @Type(() => AuthenticationType)
  @ValidateNested()
  @IsOptional()
  authentication?: AuthenticationType;

  /**
   * Assert (status code) used to assert the url status code to match this code
   */
  @Prop({ type: AssertTypeSchema })
  @IsObject()
  @Type(() => AssertType)
  @ValidateNested()
  @IsOptional()
  assert?: AssertType;

  /**
   * Http headers to include in the polling requests.
   */
  @Prop({ type: Object, _id: false })
  @IsObject()
  @IsOptional()
  httpHeaders?: object;

  /**
   * A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
   *
   * @default false
   */
  @Prop({ default: false })
  @IsBoolean()
  @IsOptional()
  ignoreSSL?: boolean;

  /**
   * The status of url, whether it is up/down now.
   */
  @Prop({ default: true })
  isUp: boolean;

  /**
   * List of tags to group checks together and search by tag name
   */
  @Prop()
  @IsOptional()
  @IsArray()
  tags?: string[];

  /**
   * The user who created this check
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Models.USER })
  user: User;

  /**
   * Report containing statistical information about the check
   */
  @Prop({ type: ReportSchema, _id: false })
  report: Report;
}

const UrlCheckSchema = SchemaFactory.createForClass(UrlCheck);

UrlCheckSchema.post(/create|insert|save/, { query: true, document: true }, async (doc: UrlCheckDocument) => {
  SchedulerService.add(doc);
});

UrlCheckSchema.post(
  /update|updateOne|findByIdAndUpdate|findOneAndUpdate/,
  {
    query: true,
    document: true,
  },
  async (doc: UrlCheckDocument) => {
    SchedulerService.update(doc);
  },
);

UrlCheckSchema.post(
  /delete|remove|deleteOne|removeOne|findByIdAndDelete|findOneAndDelete/,
  {
    query: true,
    document: true,
  },
  async (doc: UrlCheckDocument) => {
    SchedulerService.remove(doc);
  },
);

export { UrlCheckSchema };
