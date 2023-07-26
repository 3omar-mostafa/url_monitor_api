import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { isEmail, isNotEmpty } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, validate: isEmail })
  email: string;

  @Prop({ required: true, trim: true, validate: isNotEmpty })
  password: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
