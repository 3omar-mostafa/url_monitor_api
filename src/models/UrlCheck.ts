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

  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop({ required: true })
  @IsUrl()
  url: string;

  @Prop({ required: true, enum: ['http', 'https', 'tcp'], default: 'http' })
  @IsIn(['http', 'https', 'tcp'])
  @Transform((params) => params.value.toLowerCase())
  protocol: string;

  @Prop()
  @IsOptional()
  path?: string;

  @Prop({ default: 80, min: 0, max: 65535 })
  @Min(0)
  @Max(65535)
  @IsInt()
  @IsOptional()
  port?: number;

  @Prop()
  @IsUrl()
  @IsOptional()
  webhook?: string;

  @Prop({ default: 5 })
  @IsInt()
  @Min(1)
  @IsOptional()
  timeout?: number;

  @Prop({ default: 10 * 60, min: 1 })
  @IsInt()
  @Min(5)
  @IsOptional()
  interval?: number;

  @Prop({ default: 1, min: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  threshold?: number;

  @Prop({ type: AuthenticationTypeSchema })
  @IsObject()
  @Type(() => AuthenticationType)
  @ValidateNested()
  @IsOptional()
  authentication?: AuthenticationType;

  @Prop({ type: AssertTypeSchema })
  @IsObject()
  @Type(() => AssertType)
  @ValidateNested()
  @IsOptional()
  assert?: AssertType;

  @Prop({ type: Object, _id: false })
  @IsObject()
  @IsOptional()
  httpHeaders?: object;

  @Prop()
  @IsBoolean()
  ignoreSSL: boolean;

  @Prop({ default: true })
  isUp: boolean;

  @Prop()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
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
