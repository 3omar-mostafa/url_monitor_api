import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from './User';
import { SchedulerService } from '../scheduler/scheduler.service';

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
export class AssertType {
  @Prop()
  statusCode: number;
}

const AssertTypeSchema = SchemaFactory.createForClass(AssertType);

// =================================================================

@Schema()
export class UrlCheck {
  _id: ObjectId;

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

  @Prop({ type: Object, _id: false })
  httpHeaders?: object;

  @Prop({ type: AssertTypeSchema })
  assert?: AssertType;

  @Prop()
  ignoreSSL: boolean;

  @Prop({ default: true })
  isUp: boolean;

  @Prop()
  tags?: [string];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const UrlCheckSchema = SchemaFactory.createForClass(UrlCheck);

UrlCheckSchema.post(/create|insert|save/, { query: true, document: true }, async (doc: UrlCheckDocument) => {
  SchedulerService.add(doc);
  console.log(`Url Check: ${doc.id} (${doc.url}) is added, will be added to schedule`);
});

UrlCheckSchema.post(
  /update|updateOne|findByIdAndUpdate|findOneAndUpdate/,
  {
    query: true,
    document: true,
  },
  async (doc: UrlCheckDocument) => {
    SchedulerService.update(doc);
    console.log(`Url Check: ${doc.id} (${doc.url}) is updated, will be updated`);
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

    console.log(`Url Check: ${doc.id} (${doc?.url}) is deleted, will be deleted from the scheduler`);
  },
);
