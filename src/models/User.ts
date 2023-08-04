import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Allow, IsEmail, isEmail, IsMongoId, IsNotEmpty, isNotEmpty, MinLength } from 'class-validator';
import { UrlCheck } from './UrlCheck';
import { Models } from './constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  id: ObjectId;

  @Prop({ required: true })
  @IsNotEmpty()
  firstName: string;

  @Prop()
  @Allow()
  lastName?: string;

  @Prop({ required: true, unique: true, trim: true, validate: isEmail })
  @IsEmail()
  email: string;

  @Prop({ required: true, trim: true, validate: isNotEmpty })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Models.URL_CHECK })
  urlChecks: UrlCheck[];

  constructor(firstName: string, lastName: string, email: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = false;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
