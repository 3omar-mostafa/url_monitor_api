import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { IsEmail, isEmail, IsMongoId, isNotEmpty } from 'class-validator';
import { UrlCheck } from './UrlCheck';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  id: ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, validate: isEmail })
  @IsEmail()
  email: string;

  @Prop({ required: true, trim: true, validate: isNotEmpty })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'UrlCheck' })
  urlChecks: [UrlCheck];

  constructor(firstName: string, lastName: string, email: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
