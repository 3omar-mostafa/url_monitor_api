import { ObjectId } from 'mongoose';
import { Expose } from 'class-transformer';
import { User } from '../../User';
import { AssertType } from '../../UrlCheck';

export class ReturnUrlCheckDto {
  @Expose()
  id: ObjectId | string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  protocol: string;

  @Expose()
  path?: string;

  @Expose()
  port?: number;

  @Expose()
  webhook?: string;

  @Expose()
  timeout?: number;

  @Expose()
  interval?: number;

  @Expose()
  threshold?: number;

  @Expose()
  assert?: AssertType;

  @Expose()
  httpHeaders?: object;

  @Expose()
  ignoreSSL?: boolean;

  @Expose()
  isUp: boolean;

  @Expose()
  tags?: string[];

  @Expose()
  user: User | ObjectId | string;
}
