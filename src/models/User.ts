import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { IsEmail, isEmail, isNotEmpty } from 'class-validator';
import { UrlCheck } from './UrlCheck';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: ObjectId;

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

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'UrlCheck' })
  urlChecks: [UrlCheck];

  constructor(firstName: string, lastName: string, email: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = false;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
    delete returnedObject.isVerified;
  },
});
