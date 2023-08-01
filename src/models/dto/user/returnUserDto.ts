import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { UrlCheck } from '../../UrlCheck';

export class ReturnUserDto {
  @Expose()
  id: string | ObjectId;

  @Expose()
  firstName: string;

  @Expose()
  lastName?: string;

  @Expose()
  email: string;

  @Expose()
  urlChecks: UrlCheck[];
}
