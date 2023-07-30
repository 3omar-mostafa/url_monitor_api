import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from './User';
import { IsMongoId } from 'class-validator';

export type UrlCheckDocument = HydratedDocument<UrlCheck>;

@Schema({ _id: false })
export class AuthenticationType {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

const AuthenticationTypeSchema = SchemaFactory.createForClass(AuthenticationType);

@Schema({ _id: false })
export class HttpHeaderType {
  @Prop()
  key: string;

  @Prop()
  value: string;
}

const HttpHeaderTypeSchema = SchemaFactory.createForClass(HttpHeaderType);

@Schema({ _id: false })
export class AssertType {
  @Prop()
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
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['http', 'https', 'tcp'], default: 'http' })
  protocol: string;

  @Prop()
  path?: string;

  @Prop({ default: 80, min: 0, max: 65535 })
  port?: number;

  @Prop()
  webhook?: string;

  @Prop({ default: 5000 })
  timeout?: number;

  @Prop({ default: 10, min: 1 })
  interval?: number;

  @Prop({ default: 1, min: 1 })
  threshold?: number;

  @Prop({ type: AuthenticationTypeSchema })
  authentication?: AuthenticationType;

  @Prop({ type: [HttpHeaderTypeSchema], _id: false })
  httpHeaders?: [HttpHeaderType];

  @Prop({ type: AssertTypeSchema })
  assert?: AssertType;

  @Prop()
  ignoreSSL: boolean;

  @Prop()
  tags?: [string];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const UrlCheckSchema = SchemaFactory.createForClass(UrlCheck);
